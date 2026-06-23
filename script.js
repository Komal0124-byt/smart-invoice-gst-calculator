let products = [];
function showForm() {
    document.getElementById("welcomeSection").style.display = "none";
    document.getElementById("formSection").style.display = "block";
}

function showResult() {
    document.getElementById("formSection").style.display = "none";
    document.getElementById("resultSection").style.display = "block";
}

function goBack() {
    document.getElementById("resultSection").style.display = "none";
    document.getElementById("formSection").style.display = "block";
}
function calculateInvoice() {
    let invoiceNumber = "INV" + Math.floor(Math.random() * 100000);

    let today = new Date().toLocaleDateString();
    let businessName = document.getElementById("businessName").value;
    let clientName = document.getElementById("clientName").value;
    let itemName = document.getElementById("itemName").value;

    let quantity = Number(document.getElementById("quantity").value);
    let price = Number(document.getElementById("price").value);
    let discount = Number(document.getElementById("discount").value);
    let gst = Number(document.getElementById("gst").value);
    let lateFee = Number(document.getElementById("lateFee").value);
     if (businessName === "" || clientName === "" || itemName === "" || quantity <= 0 || price <= 0) {

     document.getElementById("qrImage").src = "";

     document.getElementById("result").innerHTML = `
        <h2>Error</h2>
        <p style="color:red;"><strong>Please fill all required details correctly.</strong></p>
     `;
     showResult();
     return;
     }

     if (discount < 0 || lateFee < 0) {

     document.getElementById("qrImage").src = "";

     document.getElementById("result").innerHTML = `
        <h2>Error</h2>
        <p style="color:red;"><strong>Discount and late fee cannot be negative.</strong></p>
     `;
     showResult();
     return;
     }
    let subtotal = 0;

     products.forEach(product => {
     subtotal += product.quantity * product.price;
     });
    let discountAmount = (subtotal * discount) / 100;
    let amountAfterDiscount = subtotal - discountAmount;
    let gstAmount = (amountAfterDiscount * gst) / 100;
    let cgst = gstAmount / 2;
    let sgst = gstAmount / 2;
    let finalTotal = amountAfterDiscount + gstAmount + lateFee;
    

     document.getElementById("result").innerHTML = `
        <div style="
        background:#dcfce7;
        color:#166534;
        padding:12px;
        border-radius:8px;
        margin-bottom:15px;
        font-weight:bold;
        text-align:center;
        ">
        Invoice Generated Successfully ✅
        </div>
        <h2>Invoice Preview</h2>
        <p><strong>Invoice No:</strong> ${invoiceNumber}</p>
        <p><strong>Date:</strong> ${today}</p>
        <p><strong>Business:</strong> ${businessName}</p>
        <p><strong>Client:</strong> ${clientName}</p>
        <p><strong>Item:</strong> ${itemName}</p>
        <hr><br>

        <p><strong>Subtotal:</strong> ₹${subtotal.toFixed(2)}</p>
        <p><strong>Discount:</strong> ₹${discountAmount.toFixed(2)}</p>
        <p><strong>Amount After Discount:</strong> ₹${amountAfterDiscount.toFixed(2)}</p>
        <p><strong>CGST:</strong> ₹${cgst.toFixed(2)}</p>
        <p><strong>SGST:</strong> ₹${sgst.toFixed(2)}</p>
        <p><strong>Late Fee:</strong> ₹${lateFee.toFixed(2)}</p>

        <br>
        <h3>Final Invoice Total: ₹${finalTotal.toFixed(2)}</h3>
        <p style="
        background:#fef3c7;
        padding:10px;
        border-radius:8px;
        font-weight:bold;
        ">
        Payment Status: Pending ⏳
        </p>
    `;
     let upiId = document.getElementById("upiId").value;
     let payeeName = document.getElementById("payeeName").value;

     let upiLink = `upi://pay?pa=${upiId}&pn=${payeeName}&am=${finalTotal.toFixed(2)}&cu=INR`;

     let qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiLink)}`;

     document.getElementById("qrImage").src = qrUrl;
     document.getElementById("qrBox").style.display = "block";
     showResult();
}

function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    let invoiceText = document.getElementById("result").innerText;
    invoiceText = invoiceText.replaceAll("₹", "Rs.");

    doc.setFontSize(18);
    doc.text("Smart Invoice + GST Calculator", 20, 20);

    doc.setFontSize(12);
    let lines = doc.splitTextToSize(invoiceText, 170);
    doc.text(lines, 20, 40);

    doc.save("invoice.pdf");
}
function addProduct() {

    let itemName = document.getElementById("itemName").value;
    let quantity = Number(document.getElementById("quantity").value);
    let price = Number(document.getElementById("price").value);

    if(itemName === "" || quantity <= 0 || price <= 0){
        alert("Please enter valid product details.");
        return;
    }

    products.push({
        itemName,
        quantity,
        price
    });

    renderProducts();

    document.getElementById("itemName").value = "";
    document.getElementById("quantity").value = "";
    document.getElementById("price").value = "";
}
function renderProducts() {

    let html = "";

    products.forEach((product,index)=>{

        html += `
        <div class="card">
            <strong>${product.itemName}</strong><br>
            Qty: ${product.quantity}<br>
            Price: ₹${product.price}
        </div>
        `;

    });

    document.getElementById("productList").innerHTML = html;
}