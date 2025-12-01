// ============================================
// CHRISTMAS GIFT TRACKER - JAVASCRIPT
// Nordic Winter Wonderland Edition
// ============================================

// ---------- Configuration ----------
const CONFIG = {
    repo: 'christmas-tracker',
    owner: 'catonblt',
    token: '',
    dataFile: 'gifts-data.json',
    branch: 'main',
    password: 'christmas2025'
};

const KIDS = ['Teagan', 'Addie', 'Scarlett', 'Renn'];
const BUDGET_PER_KID = 250;
const MAX_GIFTS = 100;

// ---------- State ----------
let gifts = [];
let currentFilter = { kid: 'all', wrapped: 'all' };

// ---------- Aurora Canvas Animation ----------
class AuroraCanvas {
    constructor() {
        this.canvas = document.getElementById('auroraCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.time = 0;
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    drawAurora() {
        const { width, height } = this.canvas;
        
        // Clear canvas with base color
        this.ctx.fillStyle = '#0a1628';
        this.ctx.fillRect(0, 0, width, height);

        // Draw multiple aurora layers
        this.drawAuroraLayer(0.3, '#2d5f4a', 0.15, 0);
        this.drawAuroraLayer(0.5, '#8b3a4c', 0.1, 1000);
        this.drawAuroraLayer(0.7, '#d4a574', 0.08, 2000);
        this.drawAuroraLayer(0.4, '#1a4a3a', 0.12, 3000);
    }

    drawAuroraLayer(yPosition, color, alpha, offset) {
        const { width, height } = this.canvas;
        const y = height * yPosition;
        
        this.ctx.save();
        this.ctx.globalAlpha = alpha;
        
        const gradient = this.ctx.createRadialGradient(
            width / 2 + Math.sin((this.time + offset) / 3000) * 200,
            y + Math.cos((this.time + offset) / 2000) * 50,
            0,
            width / 2,
            y,
            width * 0.6
        );
        
        gradient.addColorStop(0, color);
        gradient.addColorStop(0.5, color + '80');
        gradient.addColorStop(1, 'transparent');
        
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        
        // Draw flowing wave shape
        this.ctx.moveTo(0, height);
        
        for (let x = 0; x <= width; x += 20) {
            const wave1 = Math.sin((x / 200) + (this.time + offset) / 2000) * 40;
            const wave2 = Math.sin((x / 100) + (this.time + offset) / 3000) * 20;
            const wave3 = Math.cos((x / 150) + (this.time + offset) / 2500) * 30;
            this.ctx.lineTo(x, y + wave1 + wave2 + wave3);
        }
        
        this.ctx.lineTo(width, height);
        this.ctx.closePath();
        this.ctx.fill();
        
        this.ctx.restore();
    }

    drawStars() {
        const { width, height } = this.canvas;
        
        // Seed random for consistent stars
        const starCount = 150;
        for (let i = 0; i < starCount; i++) {
            // Use absolute value to ensure positive coordinates and sizes
            const x = Math.abs((Math.sin(i * 12.9898) * 43758.5453) % 1) * width;
            const y = Math.abs((Math.sin(i * 78.233) * 43758.5453) % 1) * height * 0.7;
            const size = Math.abs((Math.sin(i * 127.1) * 43758.5453) % 1) * 2 + 0.5;
            const twinkle = Math.sin(this.time / 500 + i) * 0.3 + 0.7;
            
            this.ctx.save();
            this.ctx.globalAlpha = Math.max(0, twinkle * 0.8);
            this.ctx.fillStyle = '#ffffff';
            this.ctx.beginPath();
            this.ctx.arc(x, y, Math.max(0.5, size), 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        }
    }

    animate() {
        this.time = performance.now();
        this.drawAurora();
        this.drawStars();
        requestAnimationFrame(() => this.animate());
    }
}

// ---------- Particle System ----------
class ParticleSystem {
    constructor() {
        this.container = document.getElementById('particles');
        this.particles = [];
        this.createParticles();
    }

    createParticles() {
        const count = 30;
        
        for (let i = 0; i < count; i++) {
            setTimeout(() => this.createParticle(), i * 500);
        }
    }

    createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 4 + 2;
        const left = Math.random() * 100;
        const duration = Math.random() * 15 + 15;
        const delay = Math.random() * 10;
        
        particle.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${left}%;
            animation-duration: ${duration}s;
            animation-delay: ${delay}s;
        `;
        
        this.container.appendChild(particle);
        this.particles.push(particle);
        
        // Recycle particle
        particle.addEventListener('animationiteration', () => {
            particle.style.left = Math.random() * 100 + '%';
        });
    }
}

// ---------- Initialize Application ----------
document.addEventListener('DOMContentLoaded', () => {
    // Start background animations
    new AuroraCanvas();
    new ParticleSystem();
    
    // Check authentication
    checkPassword();
});

function checkPassword() {
    const isAuthenticated = sessionStorage.getItem('authenticated');
    
    if (isAuthenticated === 'true') {
        initApp();
    } else {
        showPasswordScreen();
    }
}

function showPasswordScreen() {
    document.getElementById('passwordOverlay').classList.remove('hidden');
    document.getElementById('passwordInput').focus();
    
    document.getElementById('passwordSubmit').addEventListener('click', verifyPassword);
    document.getElementById('passwordInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            verifyPassword();
        }
    });
}

function verifyPassword() {
    const input = document.getElementById('passwordInput').value;
    const errorEl = document.getElementById('passwordError');
    
    if (input === CONFIG.password) {
        sessionStorage.setItem('authenticated', 'true');
        document.getElementById('passwordOverlay').classList.add('hidden');
        initApp();
    } else {
        errorEl.textContent = 'Incorrect password. Please try again.';
        document.getElementById('passwordInput').value = '';
        document.getElementById('passwordInput').focus();
        
        // Shake animation
        const container = document.querySelector('.password-container');
        container.style.animation = 'shake 0.5s';
        setTimeout(() => {
            container.style.animation = '';
        }, 500);
    }
}

function initApp() {
    loadConfig();
    initializeGifts();
    renderTable();
    setupEventListeners();
    updateSummary();
    loadFromGitHub();
}

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
    const stored = localStorage.getItem('gifts-data');
    if (stored) {
        gifts = JSON.parse(stored);
    } else {
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
                <div class="price-input-wrapper">
                    <span class="price-symbol">$</span>
                    <input type="number" 
                        data-index="${index}" 
                        data-field="price" 
                        value="${gift.price || ''}" 
                        placeholder="0"
                        step="0.01"
                        min="0">
                </div>
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
    document.getElementById('importBtn').addEventListener('click', handleImport);

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
        const percentage = Math.min((spent / BUDGET_PER_KID) * 100, 100);
        grandTotal += spent;

        // Update spent amount
        document.getElementById(`${kid.toLowerCase()}-spent`).textContent = spent.toFixed(0);
        
        // Update remaining text
        const remainingEl = document.getElementById(`${kid.toLowerCase()}-remaining`);
        if (remaining < 0) {
            remainingEl.textContent = `$${Math.abs(remaining).toFixed(0)} over budget`;
            remainingEl.classList.add('over-budget');
        } else {
            remainingEl.textContent = `$${remaining.toFixed(0)} remaining`;
            remainingEl.classList.remove('over-budget');
        }

        // Update progress ring
        const ring = document.getElementById(`${kid.toLowerCase()}-ring`);
        if (ring) {
            const circumference = 2 * Math.PI * 52; // radius = 52
            const offset = circumference - (percentage / 100) * circumference;
            ring.style.strokeDashoffset = offset;
            
            // Change color if over budget
            if (percentage >= 100) {
                ring.style.stroke = '#a94d61';
            } else if (percentage >= 80) {
                ring.style.stroke = '#d4a574';
            } else {
                ring.style.stroke = '#3d7a5f';
            }
        }
    });

    // Update totals
    document.getElementById('total-spent').textContent = `$${grandTotal.toFixed(0)}`;
    const totalRemaining = BUDGET_PER_KID * KIDS.length - grandTotal;
    document.getElementById('total-remaining').textContent = `$${totalRemaining.toFixed(0)}`;
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

function handleImport() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const importedData = JSON.parse(event.target.result);
                
                if (!Array.isArray(importedData)) {
                    showModal('Import Error', 'Invalid file format. Please select a valid gift data file.');
                    return;
                }
                
                gifts = importedData.map((gift, index) => ({
                    number: gift.number || index + 1,
                    child: gift.child || '',
                    description: gift.description || '',
                    price: parseFloat(gift.price) || 0,
                    wrapped: gift.wrapped || false
                }));
                
                while (gifts.length < MAX_GIFTS) {
                    gifts.push({
                        number: gifts.length + 1,
                        child: '',
                        description: '',
                        price: 0,
                        wrapped: false
                    });
                }
                
                if (gifts.length > MAX_GIFTS) {
                    gifts = gifts.slice(0, MAX_GIFTS);
                }
                
                saveToLocalStorage();
                renderTable();
                updateSummary();
                showModal('Import Successful', 'Your gift data has been imported successfully!');
            } catch (error) {
                console.error('Import error:', error);
                showModal('Import Error', 'Failed to import file. Please make sure it\'s a valid JSON file.');
            }
        };
        
        reader.readAsText(file);
    };
    
    input.click();
}

async function handleSaveToGitHub() {
    if (!CONFIG.repo || !CONFIG.owner || !CONFIG.token) {
        showGitHubSetupModal();
        return;
    }

    updateSyncStatus('saving', 'Saving...');

    try {
        await saveToGitHub();
        updateSyncStatus('success', 'Saved');
        setTimeout(() => updateSyncStatus('success', 'Ready'), 2000);
    } catch (error) {
        console.error('Error saving to GitHub:', error);
        updateSyncStatus('error', 'Error');
        showModal('Save Error', `Failed to save to GitHub: ${error.message}`);
    }
}

function showGitHubSetupModal() {
    const modal = document.getElementById('modal');
    document.getElementById('modalTitle').textContent = 'Cloud Sync Setup';
    document.getElementById('modalMessage').textContent = 'Enter your Personal Access Token to enable cloud synchronization:';
    
    document.getElementById('modalForm').innerHTML = `
        <label>GitHub Username</label>
        <input type="text" value="${CONFIG.owner}" disabled style="opacity: 0.5; cursor: not-allowed;">
        
        <label>Repository Name</label>
        <input type="text" value="${CONFIG.repo}" disabled style="opacity: 0.5; cursor: not-allowed;">
        
        <label>Personal Access Token</label>
        <input type="password" id="githubToken" value="${CONFIG.token}" placeholder="ghp_..." autofocus>
        <small>Create a token in GitHub: Settings → Developer settings → Personal access tokens → Tokens (classic). Required permission: repo</small>
    `;

    document.getElementById('modalCancel').style.display = 'flex';
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
    const dot = document.querySelector('.sync-dot');
    const statusText = document.querySelector('.sync-text');
    
    dot.className = 'sync-dot';
    if (status === 'saving') dot.classList.add('saving');
    if (status === 'error') dot.classList.add('error');
    
    statusText.textContent = text;
}

async function saveToGitHub() {
    const url = `https://api.github.com/repos/${CONFIG.owner}/${CONFIG.repo}/contents/${CONFIG.dataFile}`;
    
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
        // File might not exist yet
    }

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
        return;
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
            updateSyncStatus('success', 'Synced');
            setTimeout(() => updateSyncStatus('success', 'Ready'), 2000);
        } else {
            updateSyncStatus('success', 'Ready');
        }
    } catch (error) {
        console.error('Error loading from GitHub:', error);
        updateSyncStatus('success', 'Ready');
    }
}