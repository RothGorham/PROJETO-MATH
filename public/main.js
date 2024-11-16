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