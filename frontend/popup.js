// Event listener for user registration
document.getElementById('registerForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;
  
    const response = await fetch('http://localhost:3000/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });
  
    const data = await response.json();
    if (response.ok) {
      alert('Registration successful');
    } else {
      alert(data.message);
    }
  });
  
  // Event listener for user login
  document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
  
    const response = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });
  
    const data = await response.json();
    if (response.ok) {
      localStorage.setItem('token', data.token);
      alert('Login successful');
    } else {
      alert(data.message);
    }
  });
  
  // Event listener for resume upload (redirect to upload-resume.html)
  document.getElementById('uploadResumeBtn').addEventListener('click', () => {
    chrome.tabs.create({ url: chrome.extension.getURL('upload-resume.html') });
  });
  
  // Event listener for viewing profile (redirect to view-profile.html)
  document.getElementById('viewProfileBtn').addEventListener('click', () => {
    chrome.tabs.create({ url: chrome.extension.getURL('view-profile.html') });
  });
  
  // Event listener for viewing application history (redirect to view-history.html)
  document.getElementById('viewHistoryBtn').addEventListener('click', () => {
    chrome.tabs.create({ url: chrome.extension.getURL('view-history.html') });
  });
  
  // Event listener for settings (redirect to settings.html)
  document.getElementById('settingsBtn').addEventListener('click', () => {
    chrome.tabs.create({ url: chrome.extension.getURL('settings.html') });
  });

  // Event listener for viewing uploaded resume
  document.getElementById('viewResumeBtn').addEventListener('click', () => {
    const resume = JSON.parse(localStorage.getItem('resume'));
    if (resume) {
      alert(`Resume:\nName: ${resume.name}\nContact: ${resume.contact}\nWork Experience: ${resume.workExperience}`);
    } else {
      alert('No resume uploaded yet.');
    }
  });

  // Event listener for viewing application history (placeholder)
  document.getElementById('viewHistoryBtn').addEventListener('click', () => {
    alert('View Application History feature is under development.');
  });

  // Event listener for settings (placeholder)
  document.getElementById('settingsBtn').addEventListener('click', () => {
    alert('Settings feature is under development.');
  });

  // Function to send a message to the content script to fill forms
  function fillForms() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      const resume = JSON.parse(localStorage.getItem('resume')); // Assuming resume is stored in localStorage
      chrome.tabs.sendMessage(activeTab.id, { action: 'fillForm', resume: resume });
    });
  }
  
  document.getElementById('applyAllBtn').addEventListener('click', fillForms);

  // Event listener for updating profile
  document.getElementById('profileForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const contact = document.getElementById('contact').value;
    const workExperience = document.getElementById('workExperience').value;
  
    const response = await fetch('http://localhost:3000/update-profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ name, contact, workExperience })
    });
  
    const data = await response.json();
    if (response.ok) {
      alert('Profile updated successfully');
    } else {
      alert(data.message);
    }
  });

  // Event listener for fetching profile details
  document.getElementById('getProfileButton').addEventListener('click', async () => {
    const response = await fetch('http://localhost:3000/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
  
    const profile = await response.json();
    alert(`Profile:\nName: ${profile.name}\nContact: ${profile.contact}\nWork Experience: ${profile.workExperience}`);
  });
