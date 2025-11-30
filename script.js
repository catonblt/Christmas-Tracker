// Configuration
const CONFIG = {
    repo: 'christmas-tracker',
    owner: 'catonblt',
    token: '', // Will be set by user
    dataFile: 'gifts-data.json',
    branch: 'main'
};

const KIDS = ['Teagan', 'Addie', 'Scarlett', 'Renn'];
const BUDGET_PER_KID = 250;
const MAX_GIFTS = 100;

// State
let gifts = [];
let currentFilter = { kid: 'all', wrapped: 'all' };

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadConfig();
    initializeGifts();
    renderTable();
    setupEventListeners();
    updateSummary();
    loadFromGitHub();
});

function loadConfig() {
    const stored = localStorage.getItem('github-config');
    if (stored) {
        const config = JSON.parse(stored);
        CONFIG.repo = config.repo || '';
        CONFIG.owner = config.owner || '';
        CONFIG.token = config.token || '';
    }
}

function saveConfig() {
    localStorage.setItem('github-config', JSON.stringify({
        repo: CONFIG.repo,
        owner: CONFIG.owner,
        token: CONFIG.token
    }));
}

function initializeGifts() {
    // Try to load from localStorage first
    const stored = localStorage.getItem('gifts-data');
    if (stored) {
        gifts = JSON.parse(stored);
    } else {
        // Initialize empty gifts array
        gifts = Array.from({ length: MAX_GIFTS }, (_, i) => ({
            number: i + 1,
            child: '',
            description: '',
            price: 0,
            wrapped: false
        }));
    }
}

function renderTable() {
    const tbody = document.getElementById('giftTableBody');
    tbody.innerHTML = '';

    gifts.forEach((gift, index) => {
        const row = document.createElement('tr');
        
        // Apply filters
        const matchesKid = currentFilter.kid === 'all' || gift.child === currentFilter.kid;
        const matchesWrapped = currentFilter.wrapped === 'all' || 
            (currentFilter.wrapped === 'yes' && gift.wrapped) ||
            (currentFilter.wrapped === 'no' && !gift.wrapped);
        
        if (!matchesKid || !matchesWrapped) {
            row.classList.add('hidden');
        }

        row.innerHTML = `
            <td class="number">${gift.number}</td>
            <td>
                <select data-index="${index}" data-field="child">
                    <option value="">Select...</option>
                    ${KIDS.map(kid => `<option value="${kid}" ${gift.child === kid ? 'selected' : ''}>${kid}</option>`).join('')}
                </select>
            </td>
            <td>
                <input type="text" 
                    data-index="${index}" 
                    data-field="description" 
                    value="${gift.description}" 
                    placeholder="Gift description...">
            </td>
            <td>
                <input type="number" 
                    data-index="${index}" 
                    data-field="price" 
                    value="${gift.price || ''}" 
                    placeholder="0.00"
                    step="0.01"
                    min="0">
            </td>
            <td style="text-align: center;">
                <input type="checkbox" 
                    data-index="${index}" 
                    data-field="wrapped" 
                    ${gift.wrapped ? 'checked' : ''}>
            </td>
        `;

        tbody.appendChild(row);
    });
}

function setupEventListeners() {
    // Table inputs
    document.getElementById('giftTableBody').addEventListener('change', handleTableChange);
    document.getElementById('giftTableBody').addEventListener('input', handleTableChange);

    // Filters
    document.getElementById('filterKid').addEventListener('change', (e) => {
        currentFilter.kid = e.target.value;
        renderTable();
    });

    document.getElementById('filterWrapped').addEventListener('change', (e) => {
        currentFilter.wrapped = e.target.value;
        renderTable();
    });

    // Buttons
    document.getElementById('saveBtn').addEventListener('click', handleSaveToGitHub);
    document.getElementById('exportBtn').addEventListener('click', handleExport);

    // Modal
    document.getElementById('modalConfirm').addEventListener('click', handleModalConfirm);
    document.getElementById('modalCancel').addEventListener('click', closeModal);
}

function handleTableChange(e) {
    const target = e.target;
    const index = parseInt(target.dataset.index);
    const field = target.dataset.field;

    if (field === 'wrapped') {
        gifts[index][field] = target.checked;
    } else if (field === 'price') {
        gifts[index][field] = parseFloat(target.value) || 0;
    } else {
        gifts[index][field] = target.value;
    }

    saveToLocalStorage();
    updateSummary();
}

function saveToLocalStorage() {
    localStorage.setItem('gifts-data', JSON.stringify(gifts));
}

function updateSummary() {
    const totals = {
        Teagan: 0,
        Addie: 0,
        Scarlett: 0,
        Renn: 0
    };

    gifts.forEach(gift => {
        if (gift.child && totals.hasOwnProperty(gift.child)) {
            totals[gift.child] += gift.price || 0;
        }
    });

    let grandTotal = 0;

    KIDS.forEach(kid => {
        const spent = totals[kid];
        const remaining = BUDGET_PER_KID - spent;
        grandTotal += spent;

        document.getElementById(`${kid.toLowerCase()}-spent`).textContent = spent.toFixed(2);
        
        const remainingEl = document.getElementById(`${kid.toLowerCase()}-remaining`);
        if (remaining < 0) {
            remainingEl.textContent = `$${Math.abs(remaining).toFixed(2)} over budget`;
            remainingEl.classList.add('over-budget');
        } else {
            remainingEl.textContent = `$${remaining.toFixed(2)} remaining`;
            remainingEl.classList.remove('over-budget');
        }
    });

    document.getElementById('total-spent').textContent = `$${grandTotal.toFixed(2)}`;
    document.getElementById('total-remaining').textContent = `$${(BUDGET_PER_KID * KIDS.length - grandTotal).toFixed(2)}`;
}

function handleExport() {
    const dataStr = JSON.stringify(gifts, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `christmas-gifts-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
}

async function handleSaveToGitHub() {
    if (!CONFIG.repo || !CONFIG.owner || !CONFIG.token) {
        showGitHubSetupModal();
        return;
    }

    updateSyncStatus('saving', 'Saving...');

    try {
        await saveToGitHub();
        updateSyncStatus('success', 'Saved to GitHub');
        setTimeout(() => updateSyncStatus('success', 'Ready'), 2000);
    } catch (error) {
        console.error('Error saving to GitHub:', error);
        updateSyncStatus('error', 'Error saving');
        showModal('Save Error', `Failed to save to GitHub: ${error.message}`);
    }
}

function showGitHubSetupModal() {
    const modal = document.getElementById('modal');
    document.getElementById('modalTitle').textContent = 'GitHub Setup';
    document.getElementById('modalMessage').textContent = 'Enter your Personal Access Token to enable cloud sync:';
    
    document.getElementById('modalForm').innerHTML = `
        <label>GitHub Username:</label>
        <input type="text" value="${CONFIG.owner}" disabled style="background: #f0f0f0; cursor: not-allowed;">
        
        <label>Repository Name:</label>
        <input type="text" value="${CONFIG.repo}" disabled style="background: #f0f0f0; cursor: not-allowed;">
        
        <label for="githubToken">Personal Access Token:</label>
        <input type="password" id="githubToken" value="${CONFIG.token}" placeholder="ghp_..." autofocus>
        <small style="display: block; margin-top: -0.5rem; color: var(--text-muted);">
            Create a token at: Settings → Developer settings → Personal access tokens → Tokens (classic)
            <br>Required permissions: repo (or just Contents: Read and write for this repo only)
        </small>
    `;

    document.getElementById('modalCancel').style.display = 'inline-block';
    modal.classList.add('show');
}

function handleModalConfirm() {
    const tokenInput = document.getElementById('githubToken');

    if (tokenInput) {
        CONFIG.token = tokenInput.value.trim();

        if (CONFIG.token) {
            saveConfig();
            closeModal();
            handleSaveToGitHub();
        } else {
            showModal('Error', 'Please enter your Personal Access Token.');
            return;
        }
    } else {
        closeModal();
    }
}

function showModal(title, message) {
    const modal = document.getElementById('modal');
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalMessage').textContent = message;
    document.getElementById('modalForm').innerHTML = '';
    document.getElementById('modalCancel').style.display = 'none';
    modal.classList.add('show');
}

function closeModal() {
    document.getElementById('modal').classList.remove('show');
}

function updateSyncStatus(status, text) {
    const indicator = document.querySelector('.status-indicator');
    const statusText = document.querySelector('.status-text');
    
    indicator.className = 'status-indicator';
    if (status === 'saving') indicator.classList.add('saving');
    if (status === 'error') indicator.classList.add('error');
    
    statusText.textContent = text;
}

async function saveToGitHub() {
    const url = `https://api.github.com/repos/${CONFIG.owner}/${CONFIG.repo}/contents/${CONFIG.dataFile}`;
    
    // Get current file SHA if it exists
    let sha = null;
    try {
        const response = await fetch(url, {
            headers: {
                'Authorization': `token ${CONFIG.token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            sha = data.sha;
        }
    } catch (error) {
        // File might not exist yet, that's okay
    }

    // Save the file
    const content = btoa(JSON.stringify(gifts, null, 2));
    const body = {
        message: `Update gifts data - ${new Date().toLocaleString()}`,
        content: content,
        branch: CONFIG.branch
    };

    if (sha) {
        body.sha = sha;
    }

    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Authorization': `token ${CONFIG.token}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to save to GitHub');
    }

    return response.json();
}

async function loadFromGitHub() {
    if (!CONFIG.repo || !CONFIG.owner || !CONFIG.token) {
        return; // Not configured yet
    }

    updateSyncStatus('saving', 'Loading...');

    try {
        const url = `https://api.github.com/repos/${CONFIG.owner}/${CONFIG.repo}/contents/${CONFIG.dataFile}`;
        
        const response = await fetch(url, {
            headers: {
                'Authorization': `token ${CONFIG.token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            const content = atob(data.content);
            gifts = JSON.parse(content);
            saveToLocalStorage();
            renderTable();
            updateSummary();
            updateSyncStatus('success', 'Loaded from GitHub');
            setTimeout(() => updateSyncStatus('success', 'Ready'), 2000);
        } else {
            // File doesn't exist yet, that's okay
            updateSyncStatus('success', 'Ready');
        }
    } catch (error) {
        console.error('Error loading from GitHub:', error);
        updateSyncStatus('success', 'Ready (using local data)');
    }
}
