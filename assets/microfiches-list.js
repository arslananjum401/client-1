
async function requestData({ urlForDatFetch, selectMessage, urlForNextPage, key, emptyMessage, queryKey }, nest) {

    const res = await fetch(urlForDatFetch, {
        method: 'GET',
        headers: {
            'ngrok-skip-browser-warning': true
        },
    });

    const data = await res.json();
    document.getElementById("page-heading").innerText = selectMessage;

    const categoriesListContaienr = document.getElementById('list-container');

    const loopData = !nest ? data : data[queryKey];
    if (loopData?.length > 0) {

        loopData.forEach(datum => {
            const url = urlForNextPage + datum.id
            const li = document.createElement("li");

            li.innerHTML = `<a href="${url}">${datum[key]}</a>`;

            categoriesListContaienr.appendChild(li)
        });
        document.getElementById("not-found").style.display = "none"
        return data
    }
    else {

        const maincontainer = document.querySelector(".list-main-container");
        maincontainer.remove()

        document.getElementById("not-found").innerText = emptyMessage
    }
}



async function fetchData() {
    const query = new URLSearchParams(window.location.search);

    const baseUrlForNextPage = "https://client-1-which.myshopify.com/pages/navigation-microfiches";
    const baseUrlForAPI = " https://f508-39-40-181-110.ngrok-free.app/api";
    const baseUrlForProductsPage = "https://client-1-which.myshopify.com/pages/microfiches-product";

    if (query.get("yearId")) {    //to get Categories Moto

        const queryData = {
            urlForDatFetch: baseUrlForAPI + "/categoriesmoto?yearId=" + query.get("yearId"),
            urlForNextPage: baseUrlForNextPage + "?categoriesMotoId=",
            selectMessage: "Please select a Categories Moto",
            key: "categoriesMotoName",
            emptyMessage: "No Categories Moto found.",
            queryKey: "categoriesMotos"
        }
        const data = await requestData(queryData, true);

        if (data)
            BreadCrumbsCollection({ value: data?.yearRelations, key: "yearNumber" })

    }
    else if (query.get("categoriesMotoId")) { //to get models

        const queryData = {
            urlForDatFetch: baseUrlForAPI + "/models?categoriesMotoId=" + query.get("categoriesMotoId"),
            selectMessage: "Please select a Model",
            urlForNextPage: baseUrlForNextPage + "?modelId=",
            key: "modelName",
            emptyMessage: "No Model found.",
            queryKey: "models"
        }
        const data = await requestData(queryData, true)

        if (data) {
            const year = { value: data?.categoriesMotoRelations.year, key: "yearNumber" };
            const categoriesMoto = { value: data?.categoriesMotoRelations, key: "categoriesMotoName" };
            BreadCrumbsCollection(year, categoriesMoto)
        }
    }
    else if (query.get("modelId")) {      //to get categories

        const queryData = {
            urlForDatFetch: baseUrlForAPI + "/categories?modelId=" + query.get("modelId"),
            selectMessage: "Please select a Category",
            urlForNextPage: baseUrlForNextPage + "?categoryId=",
            key: "categoryName",
            emptyMessage: "No Category found.",
            queryKey: "categories"
        }
        const data = await requestData(queryData, true)
        if (data) {
            const model = { value: data?.modelRelations, key: "modelName" }
            const categoriesMoto = { value: data.modelRelations.categoriesMoto, key: "categoriesMotoName" };
            const year = { value: data.modelRelations.categoriesMoto.year, key: "yearNumber" };

            BreadCrumbsCollection(year, categoriesMoto, model)
        }
    }
    else if (query.get("categoryId")) {    //to get sub categories
        const queryData = {
            urlForDatFetch: baseUrlForAPI + "/subcategories?categoryId=" + query.get("categoryId"),
            selectMessage: "Please select a sub Category",
            urlForNextPage: baseUrlForProductsPage + "?subCategoryId=",
            key: "subCategoryName",
            emptyMessage: "No Sub Category found.",
            queryKey: "subCategories"
        }
        const data = await requestData(queryData, true);

        if (data) {
            const categoryRelations = { value: data?.categoryRelations, key: "categoryName" };
            const model = { value: data?.categoryRelations.model, key: "modelName" };
            const categoriesMoto = { value: data.categoryRelations.model.categoriesMoto, key: "categoriesMotoName" };
            const year = { value: data.categoryRelations.model.categoriesMoto.year, key: "yearNumber" };

            BreadCrumbsCollection(year, categoriesMoto, model, categoryRelations)
        }
    }


    else {
        const queryData = {
            urlForDatFetch: baseUrlForAPI + "/years",
            selectMessage: "Please select a Year",
            urlForNextPage: baseUrlForNextPage + "?yearId=",
            key: "yearNumber",
            emptyMessage: "No Year found."
        }
        const atag = document.querySelector(".home-bread-crumb").querySelector("a");
  
        atag.setAttribute("href", "#")
        requestData(queryData)
    }
}

function BreadCrumb(breadCrumbData, arrow) {
    const { name, href } = breadCrumbData;

    const breadCrumbs_container = document.querySelector(".bread-crumb-container");

    const span = document.createElement("span")
    span.classList.add("bread-crumbs")

    const a = document.createElement("a");
    a.innerHTML = `${arrow ? '<i class="fa-solid fa-arrow-left-long"></i> ' : ""}  ${name}`;
    a.setAttribute("href", href)

    span.appendChild(a);

    breadCrumbs_container.appendChild(span)
}
function BreadCrumbsCollection(year, categoriesMoto, model, categories, subCategories, product) {
    const baseUrlForClientListsPage = "https://client-1-which.myshopify.com/pages/navigation-microfiches";
    const baseUrlForClientProductPage = "https://client-1-which.myshopify.com/pages/microfiches-product";

    if (year) {

        const href = `${baseUrlForClientListsPage}`
        BreadCrumb({ href: href, name: year.value[year.key] }, true);
    }
    if (categoriesMoto) {
        const href = `${baseUrlForClientListsPage}?yearId=${year.value.id}`
        BreadCrumb({ href: href, name: categoriesMoto.value[categoriesMoto.key] }, true);
    }
    if (model) {
        const href = `${baseUrlForClientListsPage}?categoriesMotoId=${categoriesMoto.value.id}`
        BreadCrumb({ href: href, name: model.value[model.key] }, true);
    }
    if (categories) {
        const href = `${baseUrlForClientListsPage}?modelId=${model.value.id}`
        BreadCrumb({ href: href, name: categories.value[categories.key] }, true);
    }
    if (subCategories) {
        const href = `${baseUrlForClientListsPage}?categoryId=${categories.value.id}`
        BreadCrumb({ href: href, name: subCategories.value[subCategories.key] }, true);
    }
    if (product) {
        const href = `${baseUrlForClientProductPage}?subCategoryId=${subCategories.value.id}`
        BreadCrumb({ href: href, name: product.value[product.key] }, true);
    }

}

async function getProducts() {

    const baseUrlForNextPage = "https://client-1-which.myshopify.com/pages/microfiches-product";
    const baseUrlForAPI = " https://f508-39-40-181-110.ngrok-free.app/api";
    const query = new URLSearchParams(window.location.search);
    if (!query.get("subCategoryId")) {
        const maincontainer = document.querySelector("#page-container");
        maincontainer.remove();
        document.getElementById("not-found").innerText = "No product found"
        return
    }
    const res = await fetch(baseUrlForAPI + "/products?subCategoryId=" + query.get("subCategoryId"), {

        method: 'GET',
        headers: {
            'ngrok-skip-browser-warning': true
        },

    });


    if (res.status < 300) {
        const data = await res.json();

        if (data?.products?.length > 0) {

            const table = document.querySelector(".products-table");
            const tabelBody = table.getElementsByTagName("tbody")[0];


            data.products.forEach(product => {
                const tr = document.createElement("tr")

                let tds = [];
                for (let i = 0; i < 4; i++) {
                    const td = document.createElement("td")
                    td.classList.add("bg-transparent")
                    tds.push(td);
                }

                tds[0].innerText = product.ref
                tds[1].innerText = product.partNumber
                tds[2].innerText = product.description;
                tds[3].innerHTML = `<span class="action-btns-container">
                <a class="action-btn" href="tel:5551234567"><i class="fa-solid fa-phone"></i></a>
                <a class="action-btn" href="mailto:abc@example.com"><i class="fa-solid fa-envelope"></i></a>
              </span>`;
                tr.onclick = (e) => {
                    const url = `${baseUrlForNextPage}?productId=${product.id}`
                    // if (e.ctrlKey)
                    //     window.open(url, '_blank');

                    // else
                    //     window.location.href = url
                }
                tds.forEach(td => tr.appendChild(td));

                tabelBody.appendChild(tr)
            })


            fetchImage({ uri: `${baseUrlForAPI}/subcategory/${data.subCategoryRelations.id}/image`, data })



            const subCategoryRelations = { value: data.subCategoryRelations, key: "subCategoryName" };
            const categoryRelations = { value: data.subCategoryRelations.category, key: "categoryName" };
            const model = { value: data.subCategoryRelations.category.model, key: "modelName" };
            const categoriesMoto = { value: data.subCategoryRelations.category.model.categoriesMoto, key: "categoriesMotoName" };
            const year = { value: data.subCategoryRelations.category.model.categoriesMoto.year, key: "yearNumber" };

            BreadCrumbsCollection(year, categoriesMoto, model, categoryRelations, subCategoryRelations);
            document.getElementById("not-found").style.display = "none"
        }
        else {
            const maincontainer = document.querySelector("#page-container");
            maincontainer.remove();
            document.getElementById("not-found").innerText = "No product found"
        }
    }

}
async function fetchImage(imgInfo) {

    const res = await fetch(imgInfo?.uri, {
        method: "GET",
        headers: {
            'ngrok-skip-browser-warning': true
        },
    })
    const imgBlob = await res.blob();
    const imageUrl = URL.createObjectURL(imgBlob)
    const img = document.createElement("img");
    img.src = imageUrl;
    img.setAttribute("alt", imgInfo?.data?.subCategoryRelations?.subCategoryName);
    img.classList.add("subCategory-img");
    const imgContainer = document.querySelector(".img-container");
    imgContainer?.appendChild(img)
}