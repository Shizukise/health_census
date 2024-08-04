const addPatientButton = document.getElementById("addPatient");
const report = document.getElementById("report");
const btnSearch = document.getElementById('btnSearch');
const patients = [];
const available = []
const conditionSelect = document.getElementById('condition');

fetch('health_analysis.json')
.then(response => response.json())
.then(data => {
  for (let i = 0; i < data.conditions.length; i++){
    available.push(data.conditions[i].name)
  }
  for (condition of available) {
    const newSelect = document.createElement('option');
    newSelect.value = condition
    newSelect.textContent = condition
    conditionSelect.appendChild(newSelect)
  }
  }       
);





function addPatient() {
    const name = document.getElementById("name").value;
    const gender = document.querySelector('input[name="gender"]:checked');
    const age = document.getElementById("age").value;
    const condition = document.getElementById("condition").value;
    

    if (name && gender && age && condition) {
      patients.push({ name, gender: gender.value, age, condition });
      resetForm();
      generateReport();
    } else {
      let msgDiv = document.getElementById('ErrorDiv');
      let msg = document.createTextNode("Enter all parameters correctly, please.");
      msgDiv.appendChild(msg);
      addPatientButton.setAttribute('disabled','true')
    }
    const erase = setTimeout(function() {
      msgDiv = document.getElementById('ErrorDiv')
      msgDiv.innerHTML = ""
      addPatientButton.removeAttribute('disabled');
    },2000)
};

function resetForm() {
    document.getElementById("name").value = "";
    document.querySelector('input[name="gender"]:checked').checked = false;
    document.getElementById("age").value = "";
    document.getElementById("condition").value = "";
};

function generateReport() {
    const numPatients = patients.length;
    const conditionsCount = {};
    for (const condition of available) {
      conditionsCount[condition] = 0;
    }
    const genderConditionsCount = {
      Male: {},
      Female: {},
    };
    for (const condition of available) {
      genderConditionsCount["Male"][condition] = 0;
      genderConditionsCount["Female"][condition] = 0;
    }
    console.log(genderConditionsCount)

    for (const patient of patients) {
      conditionsCount[patient.condition]++;
      genderConditionsCount[patient.gender][patient.condition]++;
    }

    report.innerHTML = `Number of patients: ${numPatients}<br><br>`;
    report.innerHTML += `Conditions Breakdown:<br>`;
    for (const condition in conditionsCount) {
      report.innerHTML += `${condition}: ${conditionsCount[condition]}<br>`;
    }

    report.innerHTML += `<br>Gender-Based Conditions:<br>`;
    for (const gender in genderConditionsCount) {
      report.innerHTML += `${gender}:<br>`;
      for (const condition in genderConditionsCount[gender]) {
        report.innerHTML += `&nbsp;&nbsp;${condition}: ${genderConditionsCount[gender][condition]}<br>`;
      }
    }
  }

addPatientButton.addEventListener("click", addPatient);


function searchCondition() {
    const input = document.getElementById('conditionInput').value.toLowerCase();
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '';

    fetch('health_analysis.json')
      .then(response => response.json())
      .then(data => {
        const condition = data.conditions.find(item => item.name.toLowerCase() === input);

        if (condition) {
          const symptoms = condition.symptoms.join(', ');
          const prevention = condition.prevention.join(', ');
          const treatment = condition.treatment;

          resultDiv.innerHTML += `<h2>${condition.name}</h2>`;
          resultDiv.innerHTML += `<img src="${condition.imagesrc}" alt="">`;

          resultDiv.innerHTML += `<p><strong>Symptoms:</strong> ${symptoms}</p>`;
          resultDiv.innerHTML += `<p><strong>Prevention:</strong> ${prevention}</p>`;
          resultDiv.innerHTML += `<p><strong>Treatment:</strong> ${treatment}</p>`;
        } else {
          resultDiv.innerHTML = 'Condition not found.';
        }
      })
      .catch(error => {
        console.error('Error:', error);
        resultDiv.innerHTML = 'An error occurred while fetching data.';
      });
  }
    btnSearch.addEventListener('click', searchCondition);