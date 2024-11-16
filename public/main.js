document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('searchButton').addEventListener('click', searchStudents);
    document.getElementById('attendanceForm').addEventListener('submit', submitAttendance);
});

async function searchStudents() {
    const query = document.getElementById('searchInput').value;
    try {
        const response = await fetch(`/buscar-aluno?query=${query}`);
        const students = await response.json();
        displayStudents(students);
    } catch (error) {
        console.error('Erro ao buscar alunos:', error);
    }
}

function displayStudents(students) {
    const container = document.getElementById('studentsContainer');
    container.innerHTML = '';
    students.forEach(student => {
        const card = document.createElement('div');
        card.className = 'student-card';
        card.innerHTML = `
            <div class="student-info">
                <h3>${student.name}</h3>
                <p>CPF: ${student.cpf}</p>
            </div>
            <div class="student-actions">
                <button class="btn-primary" onclick="openAttendanceModal('${student._id}', '${student.name}')">Registrar Presença</button>
                <button class="btn-success" onclick="openChangePasswordModal('${student._id}')">Alterar Senha</button>
                <button class="btn-danger" onclick="deleteStudent('${student._id}')">Apagar Aluno</button>
            </div>
        `;
        container.appendChild(card);
    });
}

function openAttendanceModal(studentId, studentName) {
    document.getElementById('studentId').value = studentId;
    document.getElementById('studentName').value = studentName;
    document.getElementById('attendanceModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('attendanceModal').style.display = 'none';
}

async function submitAttendance(event) {
    event.preventDefault();
    const studentId = document.getElementById('studentId').value;
    const subject = document.getElementById('subject').value;
    const date = document.getElementById('date').value;
    const dayOfWeek = document.getElementById('dayOfWeek').value;
    const hours = document.getElementById('hours').value;
    const grade = document.getElementById('grade').value;
    const observation = document.getElementById('observation').value;

    try {
        const response = await fetch(`/alunos/${studentId}/presenca`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ subject, date, dayOfWeek, hours, grade, observation })
        });
        if (response.ok) {
            alert('Presença registrada com sucesso');
            closeModal();
        } else {
            alert('Erro ao registrar presença');
        }
    } catch (error) {
        console.error('Erro ao registrar presença:', error);
    }
}

async function deleteStudent(studentId) {
    try {
        const response = await fetch(`/alunos/${studentId}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            alert('Aluno apagado com sucesso');
            searchStudents();
        } else {
            alert('Erro ao apagar aluno');
        }
    } catch (error) {
        console.error('Erro ao apagar aluno:', error);
    }
}

function openChangePasswordModal(studentId) {
    const newPassword = prompt('Digite a nova senha:');
    if (newPassword) {
        changePassword(studentId, newPassword);
    }
}

async function changePassword(studentId, newPassword) {
    try {
        const response = await fetch(`/alunos/${studentId}/senha`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ password: newPassword })
        });
        if (response.ok) {
            alert('Senha alterada com sucesso');
        } else {
            alert('Erro ao alterar senha');
        }
    } catch (error) {
        console.error('Erro ao alterar senha:', error);
    }
}

async function downloadData() {
    try {
        const response = await fetch('/alunos/presenca/download');
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'presencas.xlsx';
        document.body.appendChild(a);
        a.click();
        a.remove();
    } catch (error) {
        console.error('Erro ao baixar dados de presença:', error);
    }
}

function formatCPF(cpf) {
    cpf = cpf.replace(/\D/g, ""); // Remove tudo o que não é dígito
    cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2"); // Coloca um ponto entre o terceiro e o quarto dígitos
    cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2"); // Coloca um ponto entre o sexto e o sétimo dígitos
    cpf = cpf.replace(/(\d{3})(\d{1,2})$/, "$1-$2"); // Coloca um hífen entre o nono e o décimo dígitos
    return cpf;
}

document.getElementById('searchInput').addEventListener('input', function (e) {
    e.target.value = formatCPF(e.target.value);
});

async function submitAttendance(event) {
    event.preventDefault();
    const studentId = document.getElementById('studentId').value;
    const studentName = document.getElementById('studentName').value;
    const studentCPF = document.getElementById('studentCPF').value;
    const subject = document.getElementById('subject').value;
    const date = document.getElementById('date').value;
    const dayOfWeek = document.getElementById('dayOfWeek').value;
    const hours = document.getElementById('hours').value;
    const grade = document.getElementById('grade').value;
    const observation = document.getElementById('observation').value;

    try {
        const response = await fetch(`/alunos/${studentId}/presenca`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                studentName,
                cpf: studentCPF,
                subject,
                date,
                dayOfWeek,
                hours,
                grade,
                observation
            })
        });

        if (response.ok) {
            alert('Presença registrada com sucesso!');
            closeModal();
        } else {
            const errorData = await response.json();
            alert(`Erro ao registrar presença: ${errorData.message}`);
        }
    } catch (error) {
        console.error('Erro ao registrar presença:', error);
        alert('Erro ao registrar presença.');
    }
}

function openAttendanceModal(studentId, studentName, studentCPF) {
    document.getElementById('studentId').value = studentId;
    document.getElementById('studentName').value = studentName;
    document.getElementById('studentCPF').value = studentCPF;
    document.getElementById('attendanceModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('attendanceModal').style.display = 'none';
}
/* 
======================================== */
// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Mobile menu toggle
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Contact form handling
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        // Here you would typically send the data to your server
        console.log('Form submitted:', data);
        
        // Show success message
        alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
        contactForm.reset();
    });
}

// Animate numbers when in view
const stats = document.querySelectorAll('.number');
let animated = false;

function animateNumbers() {
    if (animated) return;
    
    stats.forEach(stat => {
        const target = parseInt(stat.textContent);
        let current = 0;
        const increment = target / 50;
        const duration = 1500;
        const step = duration / 50;
        
        const counter = setInterval(() => {
            current += increment;
            if (current >= target) {
                stat.textContent = target;
                clearInterval(counter);
            } else {
                stat.textContent = Math.floor(current);
            }
        }, step);
    });
    
    animated = true;
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Animate numbers when stats section comes into view
window.addEventListener('scroll', () => {
    const statsSection = document.querySelector('.project-stats');
    if (statsSection && isInViewport(statsSection)) {
        animateNumbers();
    }
});

// Initialize AOS (Animate on Scroll) if you decide to add it
document.addEventListener('DOMContentLoaded', () => {
    // You can add initialization code here
});


// DOM Elements
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const fileInfo = document.getElementById('fileInfo');
const fileName = document.getElementById('fileName');
const sheetSelect = document.getElementById('sheetSelect');
const searchInput = document.getElementById('searchInput');
const output = document.getElementById('output');

// Current workbook data
let workbook = null;

// Event Listeners
dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('drop-zone-hover');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('drop-zone-hover');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('drop-zone-hover');
    const file = e.dataTransfer.files[0];
    handleFile(file);
});

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    handleFile(file);
});

sheetSelect.addEventListener('change', () => {
    displaySheet();
});

searchInput.addEventListener('input', debounce(() => {
    displaySheet();
}, 300));

// File handling
function handleFile(file) {
    if (!file || !file.name.endsWith('.xlsx')) {
        alert('Por favor, selecione um arquivo Excel (.xlsx)');
        return;
    }

    fileName.textContent = file.name;
    fileInfo.style.display = 'block';

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = new Uint8Array(e.target.result);
            workbook = XLSX.read(data, { type: 'array' });
            populateSheetSelect();
            displaySheet();
        } catch (error) {
            console.error('Error reading file:', error);
            alert('Erro ao ler o arquivo. Verifique se é um arquivo Excel válido.');
        }
    };
    reader.readAsArrayBuffer(file);
}

// Sheet handling
function populateSheetSelect() {
    sheetSelect.innerHTML = '';
    workbook.SheetNames.forEach(sheetName => {
        const option = document.createElement('option');
        option.value = sheetName;
        option.textContent = sheetName;
        sheetSelect.appendChild(option);
    });
}

function displaySheet() {
    if (!workbook) return;

    const selectedSheet = sheetSelect.value;
    const worksheet = workbook.Sheets[selectedSheet];
    const searchTerm = searchInput.value.toLowerCase();

    // Convert sheet data to array
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    if (data.length === 0) {
        output.innerHTML = '<p>Nenhum dado encontrado na planilha.</p>';
        return;
    }

    // Filter data based on search term
    const filteredData = searchTerm
        ? data.filter(row => 
            row.some(cell => 
                cell && cell.toString().toLowerCase().includes(searchTerm)
            )
        )
        : data;

    console.log('Filtered Data:', filteredData); // Log para depuração

    // Create table
    const table = document.createElement('table');
    
    // Create header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    data[0].forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create body
    const tbody = document.createElement('tbody');
    filteredData.slice(1).forEach(row => {
        const tr = document.createElement('tr');
        row.forEach(cell => {
            const td = document.createElement('td');
            td.textContent = cell || '';
            if (searchTerm && cell && cell.toString().toLowerCase().includes(searchTerm)) {
                td.classList.add('highlight');
            }
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });
    table.appendChild(tbody);

    // Update output
    output.innerHTML = '';
    if (filteredData.length > 1) {
        output.appendChild(table);
    } else {
        output.innerHTML = '<p>Nenhum resultado encontrado para a busca.</p>';
    }
}

// Utility function for debouncing search input
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}