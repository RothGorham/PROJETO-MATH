document.getElementById('searchInput').addEventListener('input', function (e) {
    e.target.value = formatCPF(e.target.value);
});

document.getElementById('professorCPF').addEventListener('input', function (e) {
    e.target.value = formatCPF(e.target.value);
});

function formatCPF(cpf) {
    cpf = cpf.replace(/\D/g, ""); // Remove tudo o que não é dígito
    cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2"); // Coloca um ponto entre o terceiro e o quarto dígitos
    cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2"); // Coloca um ponto entre o sexto e o sétimo dígitos
    cpf = cpf.replace(/(\d{3})(\d{1,2})$/, "$1-$2"); // Coloca um hífen entre o nono e o décimo dígitos
    return cpf;
}

function openModal(studentId, studentName, studentCPF) {
    document.getElementById('studentId').value = studentId || '';
    document.getElementById('studentName').value = studentName || '';
    document.getElementById('studentCPF').value = studentCPF || '';
    document.getElementById('attendanceModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('attendanceModal').style.display = 'none';
}

function openAddProfessorModal() {
    document.getElementById('addProfessorModal').style.display = 'flex';
}

function closeAddProfessorModal() {
    document.getElementById('addProfessorModal').style.display = 'none';
}

async function submitAttendance(event) {
    event.preventDefault();
    const studentId = document.getElementById('studentId').value;
    const studentName = document.getElementById('studentName').value;
    const cpf = document.getElementById('studentCPF').value;
    const subject = document.getElementById('subject').value;
    const date = document.getElementById('date').value;
    const dayOfWeek = document.getElementById('dayOfWeek').value;
    const hours = document.getElementById('hours').value;
    const grade = document.getElementById('grade').value;
    const observation = document.getElementById('observation').value;
    const professorName = document.getElementById('professorName').value;

    try {
        const response = await fetch('/attendance', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ studentId, studentName, cpf, subject, date, dayOfWeek, hours, grade, observation, professorName })
        });

        if (response.ok) {
            closeModal();
            alert('Presença registrada com sucesso!');
        } else {
            console.error('Erro ao registrar presença');
        }
    } catch (error) {
        console.error('Erro ao registrar presença:', error);
    }
}

async function submitAddProfessor(event) {
    event.preventDefault();
    const cpf = document.getElementById('professorCPF').value;

    try {
        const response = await fetch('/acesso', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ cpf })
        });

        if (response.ok) {
            closeAddProfessorModal();
            alert('Professor adicionado com sucesso!');
        } else {
            console.error('Erro ao adicionar professor');
        }
    } catch (error) {
        console.error('Erro ao adicionar professor:', error);
    }
}

async function searchStudents() {
    const query = document.getElementById('searchInput').value;
    try {
        const response = await fetch(`/buscar-aluno?query=${query}`);
        if (response.ok) {
            const students = await response.json();
            renderStudents(students);
        } else {
            console.error('Erro ao buscar alunos');
        }
    } catch (error) {
        console.error('Erro ao buscar alunos:', error);
    }
}

function renderStudents(students) {
    const container = document.getElementById('studentsContainer');
    container.innerHTML = '';
    students.forEach(student => {
        const studentElement = document.createElement('div');
        studentElement.className = 'student-card';
        studentElement.innerHTML = `
            <h3>${student.name}</h3>
            <p class="student-cpf">CPF: ${student.cpf}</p>
            <div class="student-actions">
                <button onclick="deleteStudent('${student._id}')" class="btn btn-danger">Apagar Aluno</button>
                <button onclick="openModal('${student._id}', '${student.name}', '${student.cpf}')" class="btn btn-primary">Registrar Presença</button>
            </div>
        `;
        container.appendChild(studentElement);
    });
}

async function deleteStudent(studentId) {
    if (confirm('Tem certeza que deseja excluir este aluno?')) {
        try {
            const response = await fetch(`/alunos/${studentId}`, { method: 'DELETE' });
            if (response.ok) {
                alert('Aluno excluído com sucesso!');
                searchStudents(); // Atualizar a lista de alunos
            } else {
                console.error('Erro ao excluir aluno');
            }
        } catch (error) {
            console.error('Erro ao excluir aluno:', error);
        }
    }
}

async function exportToCSV() {
    try {
        const response = await fetch('/attendance/download');
        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = 'presencas.xlsx';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        } else {
            console.error('Erro ao exportar dados');
        }
    } catch (error) {
        console.error('Erro ao exportar dados:', error);
    }
}

async function deleteAllStudents() {
    if (confirm('Tem certeza que deseja excluir todos os alunos?')) {
        try {
            const response = await fetch('/students', { method: 'DELETE' });
            if (response.ok) {
                alert('Todos os alunos foram excluídos com sucesso!');
                document.getElementById('studentsContainer').innerHTML = '';
            } else {
                console.error('Erro ao excluir todos os alunos');
            }
        } catch (error) {
            console.error('Erro ao excluir todos os alunos:', error);
        }
    }
}

// Carregar os alunos ao carregar a página
document.addEventListener('DOMContentLoaded', searchStudents);