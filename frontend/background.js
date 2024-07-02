// background.js

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'jobFormsDetected') {
        console.log(`Detected ${message.forms} job application forms on ${message.platform}.`);
        // Optionally, trigger further actions based on detected forms
    }
    if (message.action === 'fillForm') {
        fillForms(message.resume);
    }
    if (message.action === 'submitForm') {
        submitForm(message.platform);
    }
});

// Function to detect job application forms on the active tab
function detectJobFormsOnActiveTab() {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        const activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, { action: 'detectJobForms' });
    });
}

// Function to submit job application form on the active tab based on platform
function submitForm(platform) {
    // Add logic to send message to content script to submit the form based on platform
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, { action: 'submitForm', platform: platform });
    });
}

// Execute detection when extension icon is clicked
chrome.browserAction.onClicked.addListener(detectJobFormsOnActiveTab);
