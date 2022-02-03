// YOUR NAME HERE

// === constants ===
const MAX_QTY = 9;
const productIdKey = "product";
const orderIdKey = "order";
const inputIdKey = "qte";

// === global variables  ===
// the total cost of selected products 
var total = 0;
var msgStatement = false;


// function called when page is loaded, it performs initializations 
var init = function () {
	createShop();
	
	// TODO : add other initializations to achieve if you think it is required
}
window.addEventListener("load", init);



// usefull functions

/*
* create and add all the div.produit elements to the div#boutique element
* according to the product objects that exist in 'catalog' variable
*/
var createShop = function () {
	var shop = document.getElementById("boutique");
	for(var i = 0; i < catalog.length; i++) {
		shop.appendChild(createProduct(catalog[i], i));
	}
}

/*
* create the div.produit elment corresponding to the given product
* The created element receives the id "index-product" where index is replaced by param's value
* @param product (product object) = the product for which the element is created
* @param index (int) = the index of the product in catalog, used to set the id of the created element
*/
var createProduct = function (product, index) {
	// build the div element for product
	var block = document.createElement("div");
	block.className = "produit";
	// set the id for this product
	block.id = index + "-" + productIdKey;
	// build the h4 part of 'block'
	block.appendChild(createBlock("h4", product.name));
	
	// /!\ should add the figure of the product... does not work yet... /!\ 
	var fig = block.appendChild(createFigureBlock());
	// TODO comment
	fig.appendChild(createImage(product));
	// build and add the div.description part of 'block' 
	block.appendChild(createBlock("div", product.description, "description"));
	// build and add the div.price part of 'block'
	block.appendChild(createBlock("div", product.price, "prix"));
	// build and add control div block to product element
	block.appendChild(createOrderControlBlock(index));
	return block;
}


/* return a new element of tag 'tag' with content 'content' and class 'cssClass'
 * @param tag (string) = the type of the created element (example : "p")
 * @param content (string) = the html wontent of the created element (example : "bla bla")
 * @param cssClass (string) (optional) = the value of the 'class' attribute for the created element
 */
var createBlock = function (tag, content, cssClass) {
	var element = document.createElement(tag);
	if (cssClass != undefined) {
		element.className =  cssClass;
	}
	element.innerHTML = content;
	return element;
}

/*
* builds the control element (div.controle) for a product
* @param index = the index of the considered product
*
* TODO : add the event handling, 
*   /!\  in this version button and input do nothing  /!\  
*/
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
	var button = document.createElement("button");
	button.className = 'commander';
	button.id = index + "-" + orderIdKey;

	input.addEventListener("input", function() {
		if (input.value > 9) {
			input.value = 9;
		} else if (input.value < 0) {
			input.value = 0;
		};
		if (input.value > 0) {
			button.style.opacity = 1;
		};
	});
	button.onmousedown = function(){
		if (input.value != 0) {
			button.style.opacity = 0.25;
			addProduct(this.id);
			document.getElementById(index + "-" + inputIdKey).value = 0;
		};
	};

	// add button to control as its child
	control.appendChild(button);
	
	// the built control div node is returned
	return control;
}


/*
* create and return the figure block for this product
* see the static version of the project to know what the <figure> should be
* @param product (product object) = the product for which the figure block is created
*
* TODO : write the correct code
*/
var createFigureBlock = function () {
	return createBlock("figure", "");
}

var createImage = function (product) {
	var img = createBlock("img", "");
	img.setAttribute("src", product.image);
	return img;
}

window.onload = function() {
	const research = document.getElementById("filter");
	research.addEventListener("keyup", function() {
		const search = research.value.toLowerCase();
		for (item in catalog) {
			var product = catalog[item].name.toLowerCase();
			if (product.includes(search)) {
				document.getElementById(item + "-product").style.display = 'inline-block';
			} else {
				document.getElementById(item + "-product").style.display = 'none';
			}
		};
	});
}	

var addProduct = function(id) {
	
	// Get the product data
	const divCart = document.getElementById("achats");
	var product = id.split("-");
	var product = catalog[parseInt(product[0])];
	var orderId = id.replace("order", "qte");
	var quantity = document.getElementById(orderId).value;	
	var desc = product.description;
	var price = product.price;
	var testId = id.replace("order", "cart");

	// if the product is not already created
	if (document.getElementById(testId) == null) {
		// send to the cart
		var sendToCart = divCart.appendChild(createBlock("div", ""));
		sendToCart.className = "achat";
		sendToCart.id = id.replace("order", "cart")
	
		// create the figure block
		var fig = sendToCart.appendChild(createFigureBlock());
		fig.appendChild(createImage(product))
	
		// create the description
		sendToCart.appendChild(createBlock("h4", desc));
	
		// show the quantity
		var divQty = sendToCart.appendChild(createBlock("div", quantity));
		divQty.className = "quantite";
		divQty.id = testId.replace("cart", "quantity");
	
		// show the price 
		var divPrice = sendToCart.appendChild(createBlock("div", price));
		divPrice.className = "prix";
		cartValue(removeStatus=false, price, quantity);

		var divRemove = sendToCart.appendChild(createBlock("div", ""));
		divRemove.className = "controle";

		// create the remove button
		var removeButton = document.createElement("button");
		removeButton.className = "retirer";
		removeButton.id = id.replace("order", "remove");
		divRemove.appendChild(removeButton);
		removeButton.onclick = function(){
			removeQuantity = document.getElementById(divQty.id).innerHTML;
			document.getElementById(sendToCart.id).remove();
			cartValue(removeStatus=true, price, removeQuantity);
	};
} else {
	var product = document.getElementById(testId);
	var qty = product.getElementsByClassName("quantite")[0];
	if ((parseInt(qty.innerHTML) + parseInt(quantity)) > 9) {
		alert("La quantité maximum d'un produit est de 9.")
	} else {
		qty.innerHTML = (parseInt(qty.innerHTML) + parseInt(quantity)).toString();
		cartValue(removeStatus=false, price, quantity);
	}
}
}	

var cartValue = function(removeStatus=false, price, qty){
	price = parseInt(price);
	qty = parseInt(qty);

	if (removeStatus == true) {
		total = total - qty*price;
	} else {
		total = total + qty*price;
	};

	var divTotal = document.getElementById("montant");
	divTotal.innerHTML = total;
	cartStatement()
}

var cartStatement = function() {
	const cart = document.getElementById("achats");
	if (total > 400 && msgStatement == false){
		var errorMsg = cart.appendChild(createBlock("div", "Budget dépassé"));
		errorMsg.className = "message d'erreur";
		errorMsg.id = "error";
		msgStatement = true;
	} else if (total <= 400 && msgStatement == true) {
		document.getElementById("error").remove();
		msgStatement = false;
	};	
}