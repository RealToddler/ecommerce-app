// YOUR NAME HERE

// === constants ===
const MAX_QTY = 9;
const productIdKey = "product";
const orderIdKey = "order";
const inputIdKey = "qte";

// === global variables  ===
// the total cost of selected products 
var total = 0;



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
	input.addEventListener("input", function() {
		if (input.value > 9) {
			input.value = 9;
		};
	});

	// add input to control as its child
	control.appendChild(input);
	
	// create order button
	var button = document.createElement("button");
	button.className = 'commander';
	button.id = index + "-" + orderIdKey;
	button.onclick = function(){
		addProduct(this.id);
		cartValue();
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
		// console.log(search)
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

	var product = catalog[parseInt(id[0])];
	var orderId = id.replace("order", "qte");
	const divCart = document.getElementById("achats");
	var quantity = document.getElementById(orderId).value;	
	var desc = product.description;
	var price = product.price;

	// if product quantity not null
	if (quantity != 0) {
	
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
	
		// show the price 
		var divPrice = sendToCart.appendChild(createBlock("div", price));
		divPrice.className = "prix";
		
		var divRemove = sendToCart.appendChild(createBlock("div", ""));
		divRemove.className = "controle";


		// create the remove button
		var removeButton = document.createElement("button");
		removeButton.className = "retirer";
		removeButton.id = id.replace("order", "remove");
		removeButton.onclick = function(){
			document.getElementById(sendToCart.id).remove();
			cartValue(removeStatus=true);
		};
		divRemove.appendChild(removeButton);
		
		
	} else {
		alert("Vous ne pouvez pas commander un produit dans une quantité nulle");
	};
}	

var cartValue = function(removeStatus=false){
	var cart = document.getElementById("achats");
	var orderValue = 0;
	for (var i = 0; cart.length; i++) {
		var order = cart[i]
		qty = order.getElementByClassName("quantite");
		price = order.getElementByClassName("prix");
		if (removeStatus == true) {
			orderValue = orderValue - parseInt(qty)*parseInt(price);
		} else {
			orderValue = orderValue + parseInt(qty)*parseInt(price);
		};
	};
}