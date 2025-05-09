function onScanSuccess(decodedText, decodedResult) {
    document.getElementById('resultado').innerText = `QR Code: ${decodedText}`;
    html5QrcodeScanner.clear(); // parar scanner após leitura
}

const html5QrcodeScanner = new Html5QrcodeScanner(
"reader", { fps: 10, qrbox: 250 });

  html5QrcodeScanner.render(onScanSuccess);