// Domain Parser from App Name
function lowercaseAndRemoveSpaces(str) {
    str = str.toLowerCase();
    str = str.replace(/\s+/g, '');
    return str;
}

// Key Generator
function generateKey(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let key = '';
    for (let i = 0; i < length; i++) {
        key += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return key;
}

// Developer Account Selector
function selectAccount() {
    accountSelector = document.getElementById("accountselector");
    selectedAccount = document.getElementById("selectedaccount");
    developerName = accountSelector.value;
    selectedAccount.innerHTML = developerName;

    domainSelector = document.getElementById("domain");

    // JavaScript code to show/hide the second select option based on the selected value of the first select option
    const SelectOption = document.getElementById("accountselector");
    const NoAccountSelect = document.getElementById("noaccount");
    const Account1Select = document.getElementById("accountone");
    const Account2Select = document.getElementById("accounttwo");

    if (SelectOption.value === "") {
        NoAccountSelect.style.display = "block";
        Account1Select.style.display = "none";
        Account2Select.style.display = "none";
        selectedAccount.innerHTML = "Select an Account";
        domainSelector.innerHTML = "www.domain.com";
    }
    else if (SelectOption.value === "test-account") {
        NoAccountSelect.style.display = "none";
        Account1Select.style.display = "block";
        Account2Select.style.display = "none";

    } else if (SelectOption.value === "test-account-2") {
        NoAccountSelect.style.display = "none";
        Account1Select.style.display = "none";
        Account2Select.style.display = "block";
    } else {

        NoAccountSelect.style.display = "block";
        Account1Select.style.display = "none";
        Account2Select.style.display = "none";
    }
}

// QR Code and Token Generator and Show Information
function selectApp() {

    appSelector = document.getElementById("appselector");
    appName = appSelector.options[appSelector.selectedIndex].text;
    appDomain = appSelector.value;

    // Show Domain
    url = lowercaseAndRemoveSpaces(appDomain);
    domain = document.getElementById("domain");
    domain.innerHTML = url;

    // JWT Payload Information
    siteName = appName;
    domain = url;
    userAgent = userAgent;
    userPlatform = userPlatform;
    varifier = "signature";


    // JWT Token
    var header = {
        "alg": "HS256"
    };

    var payload = {
        "site_name": siteName.toString(),
        "url": domain,
        "browser": userAgent.toString(),
        "platform": userPlatform.toString(),
        "timestamp": Date.now().toString(),
        "issuer": varifier.toString(),
    };

    var signature = { "signature": generateKey(16) };

    // Encode JWT
    var encodedHeader = btoa(JSON.stringify(header));
    var encodedPayload = btoa(JSON.stringify(payload));
    var encodedSignature = btoa(JSON.stringify(signature));

    // Generate Token
    var token = encodedHeader + "." + encodedPayload + "." + encodedSignature;

    // Show Token
    var selectToken = document.getElementById("token");
    selectToken.innerHTML = token;

    // Show QR Code
    selectQRCode = document.getElementById("qrcode");
    selectQRCode.innerHTML = '';
    var qrCode = new QRCode(document.getElementById("qrcode"), {
        text: token,
        width: 500,
        height: 500,
        colorDark: "#000",
        colorLight: "#fff",
        correctLevel: QRCode.CorrectLevel.H
    });

    // Hide Dummy Image
    selectDummyImage = document.getElementById("dummybg");
    selectDummyImage.style.display = "none";


    // WSS Connection
    // var ws = new WebSocket("wss://localhost:8080");
    // ws.onopen = function () {
    //     ws.send(token);
    // }
    // ws.onmessage = function (evt) {
    //     var received_msg = evt.data;
    //     console.log(received_msg);
    // }
    // ws.onclose = function () {
    //     // websocket is closed.
    //     alert("Connection is closed...");
    // };

    // WSS Demo Console
    wssMessage = "Connecting to <span class='text-info'> wss://" + url + ":8080/auth</span>";
    command = document.getElementById("command");
    command.innerHTML = wssMessage;

    // Show JSON Data
    jsonMergeData = JSON.stringify(header, null, 1) + '\n' + JSON.stringify(payload, null, 2) + '\n' + JSON.stringify(signature, null, 2);
    jsonData = document.getElementById("viewcode");
    jsonData.innerHTML = jsonMergeData;

    // Control Progress Bar
    const progressBar = document.getElementById('progress');
    const progressBarWidth = 96;
    const loadingTime = 30000; // in milliseconds
    const updateInterval = 1000; // in milliseconds
    // const increment = (progressBarWidth / (loadingTime / updateInterval));
    const increment = progressBarWidth / 30;

    let currentProgress = 0;

    progressBar.style.width = "0%";
    progressBar.innerHTML = "";
    progressBar.classList.remove('bg-danger');
    progressBar.classList.remove('bg-success');

    for (let i = 0; i <= loadingTime; i += updateInterval) {
        setTimeout(function () {
            currentProgress += increment;
            progressBar.style.width = currentProgress + '%';
            progressBar.innerHTML = ((30 - currentProgress / (100 / 30))).toFixed(0) + 's';
            console.log(currentProgress);
            progressBar.classList.add('bg-success');
            if (currentProgress === 99.20000000000005) {
                progressBar.style.width = '100%';
                progressBar.innerHTML = 'Connection failed.';
                progressBar.classList.add('bg-danger');
                progressBar.classList.remove('bg-success');
                connectionSuccessful = true;
            }
        }, i);
    }
}

// Browser Detection
window.addEventListener("load", () => {
    // Parse Browser Data
    result = bowser.getParser(navigator.userAgent).getResult();

    // Show User Agent and Platform
    userAgent = result.browser.name + " " + result.browser.version;
    userPlatform = result.os.name + " " + result.os.versionName + " (" + result.platform.type + ")";
});

// Add New Application
function addApp() {
    // Get the value from the input field
    const newApp = document.getElementById('newappname').value;
    const newAppDomain = document.getElementById('newappdomain').value;

    if (newAppDomain === "" || newApp === "") {
        // Show Error Message
        notice.classList.add("text-danger");
        notice.classList.remove("text-success");
        notice.style.display = "block";
        notice = document.getElementById("notice");
        notice.innerHTML = "Please fill out all fields.";
    } else {
        // Get the select element
        const selectMenu = document.getElementById('appselector');

        // Create a new option element
        const option = document.createElement('option');
        option.value = newAppDomain;
        option.text = newApp;

        // Add the new option to the select element
        selectMenu.add(option);

        // Clear the input field
        document.getElementById('newappname').value = '';
        document.getElementById('newappdomain').value = '';

        // Show Success Message
        notice = document.getElementById("notice");
        notice.innerHTML = "Application added successfully.";
        notice.classList.add("text-success");
        notice.classList.remove("text-danger");
        notice.style.display = "block";
    }
}
