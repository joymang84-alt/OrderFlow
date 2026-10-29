const orderForm = document.getElementById("orderForm");
const orderList = document.getElementById("orderList");
const grandTotal = document.getElementById("grandTotal");

let orders = JSON.parse(localStorage.getItem("orderFlowOrders")) || [];
let editingOrderId = null;

orderForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const customerName = document.getElementById("customerName").value.trim();
    const productName = document.getElementById("productName").value.trim();
    const quantity = Number(document.getElementById("quantity").value);
    const price = Number(document.getElementById("price").value);

    if (
        customerName === "" ||
        productName === "" ||
        !Number.isInteger(quantity) ||
        quantity < 1 ||
        !Number.isFinite(price) ||
        price < 0
    ) {
        alert("Please enter valid order details.");
        return;
    }

    const order = {
        id: Date.now() + Math.random(),
        customerName: customerName,
        productName: productName,
        quantity: quantity,
        price: price
    };
if (editingOrderId !== null) {
    orders = orders.map(function(item) {
        if (item.id === editingOrderId) {
            return {
                ...item,
                customerName: customerName,
                productName: productName,
                quantity: quantity,
                price: price
            };
        }

        return item;
    });

    editingOrderId = null;
    orderForm.querySelector('button[type="submit"]').textContent = "Add Order";

} else {
    orders.push(order);
}

saveOrders();
displayOrders();
orderForm.reset();
document.getElementById("quantity").value = 1;
});

function displayOrders() {
    orderList.innerHTML = "";

    if (orders.length === 0) {
        orderList.innerHTML = `
            <tr>
                <td colspan="6" class="empty-message">
                    No orders added yet.
                </td>
            </tr>
        `;

        grandTotal.textContent = "KSh 0.00";
        return;
    }

    let totalAmount = 0;

    orders.forEach(function(order, index) {
        const itemTotal = order.quantity * order.price;
        totalAmount += itemTotal;

        const row = document.createElement("tr");

        const values = [
            index + 1,
            order.customerName,
            order.productName,
            order.quantity,
            "KSh " + order.price.toFixed(2),
            "KSh " + itemTotal.toFixed(2)
        ];

        values.forEach(function(value) {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });

        const actionCell = document.createElement("td");
        const deleteButton = document.createElement("button");
        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.type ="button";
        editButton.className="edit-button";
        editButton.addEventListener("click",function(){
            document.getElementById("customerName").value =order.customerName;
            document.getElementById("productName").value = order.productName;
            document.getElementById("quantity").value = order.quantity;
            document.getElementById("price").value = order.price;
             editingOrderId = order.id;
             orderForm.querySelector('button[type="submit"]').textContent = "Update Order";
        });

        deleteButton.textContent = "Remove";
        deleteButton.type = "button";
        deleteButton.className = "delete-button";

        deleteButton.addEventListener("click", function() {
            orders = orders.filter(function(item) {
                return item.id !== order.id;
            });
             saveOrders();
            displayOrders();
        });
        actionCell.appendChild(editButton)
        actionCell.appendChild(deleteButton);
        row.appendChild(actionCell);
        orderList.appendChild(row);
    });

    grandTotal.textContent = "KSh " + totalAmount.toFixed(2);
}
     function saveOrders() {
         localStorage.setItem("orderFlowOrders",
            JSON.stringify(orders)
         );
     }
     displayOrders();