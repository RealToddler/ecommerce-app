// ROBERT Maxime DEFONTAINE JOLIVET Emilien DEBAST Liam

// === constants ===
const MAX_QTY = 9;
const productIdKey = "product";
const orderIdKey = "order";
const inputIdKey = "qte";

// === global variables  ===
var total = 0; // total cost of selected products
var exceededBuget = false; // statement of exceeded budget message

// function called when page is loaded, it performs initializations 
var init = function () {
	createShop();
}
window.addEventListener("load", init);

// not our creation
var createShop = function () {
	var shop = document.getElementById("boutique");
	for(var i = 0; i < catalog.length; i++) {
		shop.appendChild(createProduct(catalog[i], i));
	};
}

// not our creation
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

// not our creation
var createBlock = function (tag, content, cssClass) {
	var element = document.createElement(tag);
	if (cssClass != undefined) {
		element.className =  cssClass;
	};
	element.innerHTML = content;
	return element;
}

// function done
var createFigureBlock = function () {
	// create a figure => (a bit overkilled function)
	return createBlock("figure", "");
}

// function done
var createImage = function (product) {
	// create an img tag and return it filled with product image
	var img = createBlock("img", "");
	img.setAttribute("src", product.image);
	return img;
}

// function done
var search = function(research) {
	const search = research.value.toLowerCase();
	for (item in catalog) {
		var product = catalog[item].name.toLowerCase();
		// ternary => check if the value of search variable is in products title and display the produt or not
		product.includes(search) ? document.getElementById(item + "-product").style.display = 'inline-block'
		: document.getElementById(item + "-product").style.display = 'none';
	};
}

// function done
window.onload = function() {
	// call search function everytime user's let his keys up
	const research = document.getElementById("filter");
	research.addEventListener("keyup", function() {
		search(research);
	});
}

// function done
var cartStatement = function() {
	const cart = document.getElementById("achats");
	// check if budget is exceeded and display or not an exceeded budget message
	if (total > 400 && exceededBuget == false) {
		var errorMsg = cart.appendChild(createBlock("div", "Budget dépassé"));
		errorMsg.className = "Budget dépassé";
		errorMsg.id = "exceeded-budget";
		exceededBuget = true;
	} else if (total <= 400 && exceededBuget == true) {
		document.getElementById("exceeded-budget").remove();
		exceededBuget = false;
	};	
}

// functione done
var cartValue = function(removeStatus=false, price, quantity) {
	price = parseInt(price);
	quantity = parseInt(quantity);
	// ternary => check if the order value has to be removed or added to the cart's value
	// then update cart's value
	removeStatus == true ? total = total - quantity*price : total = total + quantity*price;
	document.getElementById("montant").innerHTML = total;
	cartStatement(); // check if has to display an exceeded budget message
}

// function done
var sendProduct = function(divCart, id, cartId,  product, description, quantity, price) {
	// creating the ordered product div
	var sendToCart = divCart.appendChild(createBlock("div", ""));
	sendToCart.className = "achat";
	sendToCart.id = id.replace("order", "cart");
	sendToCart.appendChild(createFigureBlock()).appendChild(createImage(product));
	sendToCart.appendChild(createBlock("h4", description));
	
	// creating the ordered product quantity div
	var divQuantity = sendToCart.appendChild(createBlock("div", quantity));
	divQuantity.className = "quantite";
	divQuantity.id = cartId.replace("cart", "quantity");

	// creating the ordered product price div
	var divPrice = sendToCart.appendChild(createBlock("div", price));
	divPrice.className = "prix";

	// creating the button to remove the ordered product from the cart
	var removeButton = document.createElement("button");
	removeButton.className = "retirer";
	removeButton.id = id.replace("order", "remove");
	removeButton.onclick = function() {
		removeQuantity = document.getElementById(divQuantity.id).innerHTML;
		document.getElementById(sendToCart.id).remove();
		cartValue(removeStatus=true, price, removeQuantity); // updating the cart's value
	};
	
	var divRemove = sendToCart.appendChild(createBlock("div", ""));
	divRemove.className = "controle";
	divRemove.appendChild(removeButton);

	cartValue(removeStatus=false, price, quantity);
}

// function done
var updateQuantity = function(cartId, price, quantity) {
	var freshQuantity = document.getElementById(cartId).getElementsByClassName("quantite")[0];

	// check if the selected product is already ordered more than 9 times
	if ((parseInt(freshQuantity.innerHTML) + parseInt(quantity)) > 9) {
		alert("Vous ne pouvez commander que 9 fois le même produit.");
	} else {
		// update the product quantity and the cart's value
		freshQuantity.innerHTML = (parseInt(freshQuantity.innerHTML) + parseInt(quantity)).toString();
		cartValue(removeStatus=false, price, quantity);
	};
}

// function done
var addToCart = function(id) {
	// collect needed data to add a product to the cart
	const divCart = document.getElementById("achats");
	var product = catalog[parseInt(id.split("-")[0])];
	var orderId = id.replace("order", "qte");
	var quantity = document.getElementById(orderId).value;	
	var description = product.description;
	var price = product.price;
	var cartId = id.replace("order", "cart");

	// check if budget is exceeded 
	if (exceededBuget == true) {
		alert("Le budget est dépassé.");
	} else { 
		// ternary => check if selected product is already in cart or not and act accordingly
		document.getElementById(cartId) == null ? sendProduct(divCart, id, cartId, product, description, quantity, price)
		: updateQuantity(cartId, price, quantity);
	};
}

// function done
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
		// ternary => set up input's limits and button style according to input's value
		input.value > 9 ? input.value = 9 : input.value;
		input.value < 0 ? input.value = 0 : input.value;
		input.value > 0 ? orderButton.style.opacity = 1 : orderButton.style.opacity = 0.25;
	});

	orderButton.onmousedown = function() {
		if (input.value > 0) {
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