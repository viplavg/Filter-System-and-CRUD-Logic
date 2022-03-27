// loading data from local storage
let products = [];

if(localStorage.getItem("products") !== null){
    products = JSON.parse(localStorage.getItem("products"));
}else {
    localStorage.setItem("products", JSON.stringify(products));
}

// copying it in temporary array for filteration logic
let filtered_products = products;


// Pagination logic --->>>
// getting total pages

let totalPages = null;
let currentPage = null;
let start = null;
let end = null;
let paginate = [];

function setupPagination(){

    totalPages = Math.ceil(filtered_products.length/10);
    document.getElementById("totalpages").innerText = totalPages;

    currentPage = 1;
    document.getElementById("currentpage").innerText = currentPage;

    for(let i=1; i<=totalPages;i++){
        let link = document.createElement("a");
        link.classList.add("pagelink");
        link.append(i);
        link.onclick = function(){
            openPage(i);
        };
        document.getElementById("pagelinks").appendChild(link);
    }


    start = (currentPage - 1) * 10;
    end = currentPage * 10;

    paginate = filtered_products.slice(start, end);

}

//function to display the data into the table
const display = (arr) => {

    document.getElementById("data").innerHTML = "";
    let numbering = start + 1;

    arr.forEach((product, index) => {

    let new_row = document.createElement("tr");

    
    let number = document.createElement("td");
    number.append(numbering);
    new_row.appendChild(number);

    numbering++;

    let nameTD = document.createElement("td");
    nameTD.append(product.name);
    new_row.appendChild(nameTD);

    let categoryTD = document.createElement("td");
    categoryTD.append(product.category);
    new_row.appendChild(categoryTD);

    let priceTD = document.createElement("td");
    priceTD.append(product.price);
    new_row.appendChild(priceTD);

    let imageTD = document.createElement("td");
    let imageEL = document.createElement("img");
    imageEL.src = product.image;
    imageEL.classList.add("prod_img");
    imageTD.appendChild(imageEL);   
    new_row.appendChild(imageTD);

    let sellerTD = document.createElement("td");
    sellerTD.append(product.seller);
    new_row.appendChild(sellerTD);

    let companyTD = document.createElement("td");
    companyTD.append(product.company);
    new_row.appendChild(companyTD);

    let actionsTD = document.createElement("td");
  
    let viewIcon = document.createElement("i");
    viewIcon.classList.add("fa-solid");
    viewIcon.classList.add("fa-eye");
    actionsTD.appendChild(viewIcon);
    viewIcon.addEventListener("click", ()=>viewProduct(product.id));

    let editIcon = document.createElement("i");
    editIcon.classList.add("fa-solid");
    editIcon.classList.add("fa-pen-to-square");
    actionsTD.appendChild(editIcon);
    editIcon.addEventListener("click", ()=>editProduct(product.id));

    let deleteIcon = document.createElement("i");
    deleteIcon.classList.add("fa-solid");
    deleteIcon.classList.add("fa-trash-can");
    actionsTD.appendChild(deleteIcon);
    deleteIcon.addEventListener("click", ()=>deleteProduct(product.id));


    new_row.appendChild(actionsTD);
    
    document.getElementById("data").appendChild(new_row);

});}


//setup pagination along with the display of data
// and display paginate array i.e., upto 10 data at once
setupPagination();
display(paginate);

//function to go to next page
function next() {

    if(currentPage < totalPages){
        currentPage++;
        openPage(currentPage);
    }
    
}

//function to go to previous page
function prev() {

    if(currentPage > 1){
        currentPage--;
        openPage(currentPage);
    }
}

//function to open any page 
function openPage(pageno){

    currentPage = pageno;
    if(currentPage!=="" && currentPage !== null && currentPage >= 1 && currentPage <= totalPages){
        
        document.getElementById("currentpage").innerText = currentPage;
        start = (currentPage - 1) * 10;
        end = currentPage * 10;
        paginate = filtered_products.slice(start, end);
        display(paginate);
    }
}


//Filteration functionality starts from here --->>>
let filters = {
    name: null,
    category: null,
    priceRange: null,
    seller: null,
    company: null
};

//read the value from input fields
const readInput = (event, propertyName) => {

    let value = event.target.value;
    if(value !== ""){
        filters[propertyName] = value;
    }else {
        filters[propertyName] = null;
    }
}

//actual filter function 
const filter = () => {

    filtered_products = products;


    if(filters.name !== null){

        filtered_products = filtered_products.filter((product) => {
        return filters.name.toLowerCase() === product.name.toLowerCase();
    });

    }

    if(filters.category !== null){

        filtered_products = filtered_products.filter((product) => {
        return filters.category.toLowerCase() === product.category.toLowerCase();
    });

    }

    if(filters.priceRange !== null){
        
        let price = filters.priceRange.split("-");
        filtered_products = filtered_products.filter(
            (product) => {
                return product.price >= Number(price[0]) &&
                Number(product.price <= price[1]);
            }
        )
    }

    if(filters.seller !== null){
        filtered_products = filtered_products.filter(
            (product) => {
                return (filters.seller.split(" ")[0].toLowerCase() ===
                product.seller.split(" ")[0].toLowerCase());
            }
        )
    }

    if(filters.company !== null){
        filtered_products = filtered_products.filter(
            (product) => {
                return filters.company.toLowerCase() === product.company.toLowerCase();
            }
        )
    }

    if(filtered_products.length !== 0){
        setupPagination();
        display(paginate);
    }

    
}


//modals openning logic
function toggleModal(open, modalID){
    if(open){
        document.getElementById(modalID).style.display = "flex";
    } else {
        document.getElementById(modalID).style.display = "none";
    }
}

//modals closing logic
function closeModal(event, modalID){
    const id = event.target.id;
    if(id === modalID){
        toggleModal(false, modalID);
    }
}

// function to add new product
function addProduct() {

    let newProducts = {};

    if(products.length !== 0){
        let last_id = products[products.length-1].id;
        newProducts.id = ++last_id;
    }else {
        newProducts.id = 1;
    }

    newProducts.name = document.getElementById("name").value;
    newProducts.category = document.getElementById("category").value;
    newProducts.price = Number(document.getElementById("price").value);
    newProducts.seller = document.getElementById("seller").value;
    newProducts.company = document.getElementById("company").value;
    newProducts.image = document.getElementById("prod_image").value;

    products.push(newProducts);

    document.getElementById("name").value = "";
    document.getElementById("category").value = "";
    document.getElementById("price").value = "";
    document.getElementById("seller").value = "";
    document.getElementById("company").value = "";
    document.getElementById("prod_image").value = "";

    display(filtered_products);
    toggleModal(false, 'add_modal');

    localStorage.setItem("products", JSON.stringify(products));
}


// function to view Product
function viewProduct(id){

    toggleModal(true, 'view_modal');

    let product = products.find((product, index)=>{
        return product.id === id;
    });

    document.getElementById("view_product_image").
    src = product.image;

    document.getElementById("head").innerText = product.name;

    document.getElementById("view_seller").innerText = product.seller;

    document.getElementById("view_price").innerText = product.price;
}

// function to delete product
let deleteID = null;

function deleteProduct(id){
    deleteID = id;
    toggleModal(true, 'delete_modal');
}

function confirmation(status){

    if(status){
        let productIndex = filtered_products.findIndex((product, index)=>{
            return product.id === deleteID;
        })
        
        filtered_products.splice(productIndex, 1);

        let mainproductIndex = products.findIndex((product, index)=>{
            return product.id === deleteID;
        })

        products.splice(mainproductIndex, 1);

        start = (currentPage - 1) * 10;
        end = currentPage * 10;

        paginate = filtered_products.slice(start, end);
        
        localStorage.setItem("products", JSON.stringify(products));
       
        display(paginate);
        
    }

    toggleModal(false, 'delete_modal');
}


// function to edit/update product
let Updateproduct;

function editProduct(id){

    toggleModal(true, 'edit_modal');

    Updateproduct = products.find((product, index)=>{
        return product.id === id;
    })

    document.getElementById("name_edit").value = Updateproduct.name;
    document.getElementById("category_edit").value = Updateproduct.category;
    document.getElementById("price_edit").value = Updateproduct.price;
    document.getElementById("seller_edit").value = Updateproduct.seller;
    document.getElementById("company_edit").value = Updateproduct.company;
    document.getElementById("prod_image_edit").value = Updateproduct.image;
    
}

function UpdateProduct(){

    Updateproduct.name = document.getElementById("name_edit").value;
    Updateproduct.category = document.getElementById("category_edit").value;
    Updateproduct.price = document.getElementById("price_edit").value;
    Updateproduct.seller = document.getElementById("seller_edit").value;
    Updateproduct.company = document.getElementById("company_edit").value;
    Updateproduct.image = document.getElementById("prod_image_edit").value;

    display(paginate);

    toggleModal(false, 'edit_modal');

    localStorage.setItem("products", JSON.stringify(products));

}