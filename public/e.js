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