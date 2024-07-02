// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'detectJobForms') {
        detectJobForms();
    } else if (message.action === 'fillForm') {
        fillForms(message.resume);
    } else if (message.action === 'submitForm') {
        submitForm(message.platform);
    }
});

function detectJobForms() {
    // Implement logic to detect job application forms on LinkedIn and Indeed
    
    // Example: Detect forms on LinkedIn
    if (window.location.hostname === 'www.linkedin.com') {
        const forms = document.querySelectorAll('your-css-selector-for-linkedin-job-forms');
        console.log(`Detected ${forms.length} job application forms on LinkedIn.`);
        chrome.runtime.sendMessage({ action: 'jobFormsDetected', platform: 'LinkedIn', forms: forms.length });
    }
    
    // Example: Detect forms on Indeed
    if (window.location.hostname === 'www.indeed.com') {
        const forms = document.querySelectorAll('your-css-selector-for-indeed-job-forms');
        console.log(`Detected ${forms.length} job application forms on Indeed.`);
        chrome.runtime.sendMessage({ action: 'jobFormsDetected', platform: 'Indeed', forms: forms.length });
    }
}

function fillForms(resume) {
    if (window.location.hostname.includes('linkedin.com')) {
        fillLinkedInForm(resume);
    }

    if (window.location.hostname.includes('indeed.com')) {
        fillIndeedForm(resume);
    }
}

function submitForm(platform) {
    if (platform === 'LinkedIn') {
        submitLinkedInForm();
    }
    if (platform === 'Indeed') {
        submitIndeedForm();
    }
}

function fillLinkedInForm(resume) {
    // Replace 'your-css-selector' with actual CSS selectors for LinkedIn
    document.querySelector('your-css-selector-for-name').value = resume.name;
    document.querySelector('your-css-selector-for-contact').value = resume.contact;
    document.querySelector('your-css-selector-for-experience').value = resume.workExperience;
    // Add more fields as needed
}

function fillIndeedForm(resume) {
    // Replace 'your-css-selector' with actual CSS selectors for Indeed
    document.querySelector('your-css-selector-for-name').value = resume.name;
    document.querySelector('your-css-selector-for-contact').value = resume.contact;
    document.querySelector('your-css-selector-for-experience').value = resume.workExperience;
    // Add more fields as needed
}

function submitLinkedInForm() {
    // Implement submission logic for LinkedIn form
    document.querySelector('your-submit-button-selector').click(); // Replace with actual submit button selector
}

function submitIndeedForm() {
    // Implement submission logic for Indeed form
    document.querySelector('your-submit-button-selector').click(); // Replace with actual submit button selector
}
