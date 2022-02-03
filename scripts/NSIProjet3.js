// LIAM MAXIME EMILIEN

// === constants ===
const MAX_QTY = 9;
const productIdKey = "product";
const orderIdKey = "order";
const inputIdKey = "qte";

// === global variables  ===
var total = 0; // total cost of selected products
var msgStatement = false; // statement of exceeded budget message

// function called when page is loaded, it performs initializations 
var init = function () {
	createShop();
}
window.addEventListener("load", init);

// OK
var createShop = function () {
	var shop = document.getElementById("boutique");
	for(var i = 0; i < catalog.length; i++) {
		shop.appendChild(createProduct(catalog[i], i));
	};
}

// OK
var createProduct = function (product, index) {
	// creating product's container
	var block = document.createElement("div");
	block.className = "produit";
	block.id = index + "-" + productIdKey;

	// appening product's data to product's container
	block.appendChild(createBlock("h4", product.name));
	block.appendChild(createFigureBlock()).appendChild(createImage(product));
	block.appendChild(createBlock("div", product.description, "description"));
	block.appendChild(createBlock("div", product.price, "prix"));
	block.appendChild(createOrderControlBlock(index));
	return block;
}

// OK
var createBlock = function (tag, content, cssClass) {
	var element = document.createElement(tag);
	if (cssClass != undefined) {
		element.className =  cssClass;
	};
	element.innerHTML = content;
	return element;
}

// OK
var createOrderControlBlock = function (index) {
	var control = document.createElement("div");
	control.className = "controle";

	// create input quantity element
	var input = document.createElement("input");
	input.id = index + '-' + inputIdKey;
	input.type = "number";
	input.step = "1";
	input.value = "0";
	input.min = "0";
	input.max = MAX_QTY.toString();
	
	// add input to control as its child
	control.appendChild(input);

	// create order button
	var orderButton = document.createElement("button");
	orderButton.className = 'commander';
	orderButton.id = index + "-" + orderIdKey;

	// setting input's conditions
	input.addEventListener("input", function() {
		input.value > 9 ? input.value = 9 : input.value;
		input.value < 0 ? input.value = 0 : input.value;
		input.value > 0 ? orderButton.style.opacity = 1 : orderButton.style.opacity = 0.25;
	});

	orderButton.onmousedown = function() {
		if (input.value != 0) {
			orderButton.style.opacity = 0.25;
			addToCart(this.id);
			document.getElementById(index + "-" + inputIdKey).value = 0; // setting back input's value to 0
		};
	};

	// add button to control as its child
	control.appendChild(orderButton);
	
	// the built control div node is returned
	return control;
}

// OK
var createFigureBlock = function () {
	return createBlock("figure", "");
}

// OK
var createImage = function (product) {
	var img = createBlock("img", "");
	img.setAttribute("src", product.image);
	return img;
}

// OK
var search = function(research) {
	const search = research.value.toLowerCase();
	for (item in catalog) {
		var product = catalog[item].name.toLowerCase();
		product.includes(search) ? document.getElementById(item + "-product").style.display = 'inline-block'
		: document.getElementById(item + "-product").style.display = 'none';
	};
}

// OK
window.onload = function() {
	const research = document.getElementById("filter");
	research.addEventListener("keyup", function() {
		search(research);
	});
}

// OK
var cartStatement = function() {
	const cart = document.getElementById("achats");
	if (total > 400 && msgStatement == false) {
		var errorMsg = cart.appendChild(createBlock("div", "Budget dépassé"));
		errorMsg.className = "Budget dépassé";
		errorMsg.id = "exceeded-budget";
		msgStatement = true;
	} else if (total <= 400 && msgStatement == true) {
		document.getElementById("exceeded-budget").remove();
		msgStatement = false;
	};	
}

// OK
var cartValue = function(removeStatus=false, price, quantity) {
	price = parseInt(price);
	quantity = parseInt(quantity);
	removeStatus == true ? total = total - quantity*price : total = total + quantity*price;
	var divTotal = document.getElementById("montant");
	divTotal.innerHTML = total;
	cartStatement();
}

// OK
var sendProduct = function(divCart, id, cartId,  product, description, quantity, price) {
	var sendToCart = divCart.appendChild(createBlock("div", ""));
	sendToCart.className = "achat";
	sendToCart.id = id.replace("order", "cart");
	sendToCart.appendChild(createFigureBlock()).appendChild(createImage(product));
	sendToCart.appendChild(createBlock("h4", description));
	
	var divQuantity = sendToCart.appendChild(createBlock("div", quantity));
	divQuantity.className = "quantite";
	divQuantity.id = cartId.replace("cart", "quantity");

	var divPrice = sendToCart.appendChild(createBlock("div", price));
	divPrice.className = "prix";

	var removeButton = document.createElement("button");
	removeButton.className = "retirer";
	removeButton.id = id.replace("order", "remove");
	removeButton.onclick = function() {
		removeQuantity = document.getElementById(divQuantity.id).innerHTML;
		document.getElementById(sendToCart.id).remove();
		cartValue(removeStatus=true, price, removeQuantity);
	};
	
	var divRemove = sendToCart.appendChild(createBlock("div", ""));
	divRemove.className = "controle";
	divRemove.appendChild(removeButton);

	cartValue(removeStatus=false, price, quantity);
}

// OK
var updateQuantity = function(cartId, price, quantity) {
	var product = document.getElementById(cartId);
	var freshQuantity = product.getElementsByClassName("quantite")[0];
	if ((parseInt(freshQuantity.innerHTML) + parseInt(quantity)) > 9) {
		alert("Vous ne pouvez commander que 9 fois le même produit.");
	} else {
		freshQuantity.innerHTML = (parseInt(freshQuantity.innerHTML) + parseInt(quantity)).toString();
		cartValue(removeStatus=false, price, quantity);
	};
}

// OK
var addToCart = function(id) {
	const divCart = document.getElementById("achats");
	var product = catalog[parseInt(id.split("-")[0])];
	var orderId = id.replace("order", "qte");
	var quantity = document.getElementById(orderId).value;	
	var description = product.description;
	var price = product.price;
	var cartId = id.replace("order", "cart");
	if (total > 400) {
		alert("Le budget est dépassé.")
	} else {
		document.getElementById(cartId) == null ? sendProduct(divCart, id, cartId, product, description, quantity, price)
		: updateQuantity(cartId, price, quantity);
	};
}