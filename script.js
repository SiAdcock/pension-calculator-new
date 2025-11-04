const ORDINARY_PERSONAL_CONTRIBUTION_RATE = 0.05;
const ORDINARY_EMPLOYER_CONTRIBUTION_RATES = {
    0: 0.08,
    45: 0.09,
    50: 0.10,
    55: 0.11,
    60: 0.12
};
const CONTRIBUTION_RATE_OPTIONS = {
    full: 1,
    half: 0.5,
    none: 0
}

const getEmployerContributionRate = (age) => {
    if (age < 45) {
        return ORDINARY_EMPLOYER_CONTRIBUTION_RATES[0];
    } else if (age >= 45 && age < 50) {
        return ORDINARY_EMPLOYER_CONTRIBUTION_RATES[45];
    } else if (age >= 50 && age < 55) {
        return ORDINARY_EMPLOYER_CONTRIBUTION_RATES[50];
    } else if (age >= 55 && age < 60) {
        return ORDINARY_EMPLOYER_CONTRIBUTION_RATES[55];
    } else {
        return ORDINARY_EMPLOYER_CONTRIBUTION_RATES[60];
    }
}

const calculatePensionOrdinary = (age, salary, option) =>{    
    const monthlySalary = salary / 12;
    const pensionContributionPersonal = ORDINARY_PERSONAL_CONTRIBUTION_RATE * monthlySalary * CONTRIBUTION_RATE_OPTIONS[option];
    const pensionContributionEmployer = getEmployerContributionRate(age) * monthlySalary * CONTRIBUTION_RATE_OPTIONS[option];

    return {
        personal: pensionContributionPersonal,
        employer: pensionContributionEmployer,
        total: pensionContributionPersonal + pensionContributionEmployer
    }
}

const getEmployerAvcRate = (avc) => {
    return (avc - ORDINARY_PERSONAL_CONTRIBUTION_RATE) / 2;
}

const calculatePensionAvcs = (age, salary, avc) =>{    
    const monthlySalary = salary / 12;
    const employerAvcRate = getEmployerAvcRate(avc);
    const pensionContributionPersonal = (avc) * monthlySalary;
    const pensionContributionEmployer = (getEmployerContributionRate(age) + employerAvcRate) * monthlySalary;

    return {
        personal: pensionContributionPersonal,
        employer: pensionContributionEmployer,
        total: pensionContributionPersonal + pensionContributionEmployer
    }
}

const calculateTotalPensionContribution = (ordinary, avc) => {
    return {
        personal: ordinary.personal + avc.personal,
        employer: ordinary.employer + avc.employer,
        total: ordinary.total + avc.total
    }
}

const updatePensionContributionOrdinary = (age, option, {personal, employer, total}) => {
    document.querySelector('.result__ordinary').classList.add('visible');
    document.querySelector('.next-steps').classList.add('visible');
    if (option === 'full') {
        document.querySelector('.result__avc').classList.add('visible');
    } else {
        document.querySelector('.result__avc').classList.remove('visible');
    }
    document.getElementById('ordinary-contribution-rate-you').innerText = (ORDINARY_PERSONAL_CONTRIBUTION_RATE * CONTRIBUTION_RATE_OPTIONS[option] * 100).toFixed(1);
    document.getElementById('ordinary-contribution-rate-guardian').innerText = (getEmployerContributionRate(age) * CONTRIBUTION_RATE_OPTIONS[option] * 100).toFixed(1);
    document.getElementById('ordinary-contribution-you').innerText = personal.toFixed(2);
    document.getElementById('ordinary-contribution-guardian').innerText = employer.toFixed(2);
    document.getElementById('ordinary-contribution-total-amount').innerText = total.toFixed(2);
}

const updatePensionContributionAvcs = (age, avc, {personal, employer, total}) => {
    document.getElementById('avc-contribution-rate-you').innerText = (avc * 100).toFixed(1);
    document.getElementById('avc-contribution-rate-guardian').innerText = ((getEmployerContributionRate(age) + getEmployerAvcRate(avc)) * 100).toFixed(1);
    document.getElementById('avc-contribution-you').innerText = personal.toFixed(2);
    document.getElementById('avc-contribution-guardian').innerText = employer.toFixed(2);
    document.getElementById('avc-contribution-total-amount').innerText = total.toFixed(2);
    document.getElementById('avc-contribution-total-rate').innerText = ((avc * 100) + (getEmployerContributionRate(age) + getEmployerAvcRate(avc)) * 100).toFixed(1);
}

const bindEvents = () => {
  document.getElementById('calculate-ordinary-contribution').addEventListener('click', () => {
    const age = parseInt(document.getElementById('age').value, 10);
    const salary = parseFloat(document.getElementById('salary').value);
    const option = document.querySelector('input[name="contribution-option"]:checked').value;
    const avc = parseFloat(document.getElementById('avc-range').value);

    updatePensionContributionOrdinary(age, option, calculatePensionOrdinary(age, salary, option));
    updatePensionContributionAvcs(age, avc, calculatePensionAvcs(age, salary, avc));
  });

  document.getElementById('avc-range').addEventListener('change', () => {
    const age = parseInt(document.getElementById('age').value, 10);
    const salary = parseFloat(document.getElementById('salary').value);
    const avc = parseFloat(document.getElementById('avc-range').value);
    // We assume full rate contributions for AVCs
    updatePensionContributionAvcs(age, avc, calculatePensionAvcs(age, salary, avc));
  });
}

window.addEventListener("load", () => {
  bindEvents();
});