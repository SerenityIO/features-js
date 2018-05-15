class Form {
    constructor(){
        this.state = {
            selects: {
                receiving      : $('#receiving'),
                material_type  : $('#material-type'),
                material_unit  : $('#material-units'),
                region         : $('#region'),
                city           : $('#city'),
                district       : $('#district'),
                settlements     : $('#settlements')
            },
            inputs: {
                address: $('#adress'),
                name_of  : $('#name-of')
            },
            buttons: {
                add_to_handbook     : $('#add-to-handbook'),
                load_from_handbook  : $('#load-from-handbook'),
                add_equip           : $('#add-equip'),
                clear_canvas        : $('#clear-canvas'),
                receive             : $('.receive'),
                transfer            : $('.transfer'),
                save_canvas         : $('#save-canvas'),
                submit              : $('#submit')
            },
            data : {

            },
            images: {
                receive  : $('#receive-img'),
                transfer : $('#transfer-img')
            },
            wh_list           : $('#wh-list'),
            material_list        : $('#material-list'),
            canvas            : document.getElementById('canvas'),
            isDrawing         : false,
            canvasContainer   :  $('.canvas-back'),
            imageType         : '',
            output:{
                receiveSignature: '',
                transferSignature: ''
            },
            alert: $('#alert'),
            values: {
                region: null,
                city: null,
                district: null,
                settlements : null
            }
        };

        this.loadFromHandbookWarehouse = this.loadFromHandbookWarehouse.bind(this);
        this.startDrawling = this.startDrawling.bind(this);
        this.stopDrawing = this.stopDrawing.bind(this);
        this.draw = this.draw.bind(this);
        this.startDrawling = this.startDrawling.bind(this);

        this.getAllData();
        this.select2initialize();
        this.initializeHandlers();
        this.canvas();
    }

    canvas(){

        this.state.ctx = this.state.canvas.getContext('2d');
        this.state.ctx.lineWidth = 5;
        this.state.ctx.strokeStyle = "#000000";
        this.state.canvas.onmousedown = this.startDrawling;
        this.state.canvas.onmouseup = this.stopDrawing;
        this.state.canvas.onmouseout = this.stopDrawing;
        this.state.canvas.onmousemove = this.draw;

    }

    startDrawling(e){
        let scrolled = window.pageYOffset || document.documentElement.scrollTop;
        this.state.isDrawing = true;
        this.state.ctx.beginPath();
        this.state.ctx.moveTo(e.pageX - this.state.canvas.offsetLeft, e.pageY - this.state.canvas.offsetTop - scrolled)
    }

    stopDrawing(){
        this.state.isDrawing = false;
    }

    draw(e){
        if (this.state.isDrawing === true)
        {
            let scrolled = window.pageYOffset || document.documentElement.scrollTop;
            let x = e.pageX - this.state.canvas.offsetLeft;
            let y = e.pageY - this.state.canvas.offsetTop - scrolled;

            this.state.ctx.lineTo(x, y);
            this.state.ctx.stroke();
        }
    }

    clearCanvas() {
        this.state.ctx.clearRect(0, 0, this.state.canvas.width, this.state.canvas.height);
    }

    select2initialize(){
        for (let item in this.state.selects ){
            this.state.selects[item].select2();
        }
    }

    getRegions(id = null){
        $.ajax({
            type: 'GET',
            url: '/api/handbook/common/region'
        }).done((data) => {

            this.state.data['region'] = data;
            for (let item in this.state.data['region'] ){
                this.state.selects['region']
                    .append(
                        new Option(
                            this.state.data['region'][item].name,
                            this.state.data['region'][item].id,
                            false,
                            this.state.data['region'][item].id == id ? true : false)
                    )
            }
        })
    }

    getCities(id = null, region = null){
        $.ajax({
            type: 'GET',
            url: `/api/handbook/common/region/${region ? region :this.state.selects.region.val()}/cities`
        }).done((data) => {

            this.state.data['city'] = data;
            for (let item in this.state.data['city'] ){
                this.state.selects['city']
                    .append(
                        new Option(
                            this.state.data['city'][item].name,
                            this.state.data['city'][item].id,
                            false,
                            this.state.data['city'][item].id == id ? true : false)
                    )
            }
        })
    }

    getDistrict(id = null,city = null){
        $.ajax({
            type: 'GET',
            url: `/api/handbook/common/region/${city ? city : this.state.selects.city.val()}/areas`
        }).done((data) => {
            this.state.data['district'] = data;
            console.log(data);
            console.log(id);
            for (let item in this.state.data['district'] ){
                this.state.selects['district']
                    .append(
                        new Option(
                            this.state.data['district'][item].name,
                            this.state.data['district'][item].id,
                            false,
                            this.state.data['district'][item].id == id ? true : false)
                    )
            }
        })
    }

    getSettlement(id = null,district = null){
        $.ajax({
            type: 'GET',
            url: `/api/handbook/common/region/${district ? district : this.state.selects.district.val()}/settlements`
        }).done((data) => {
            this.state.data['settlements'] = data;
            console.log(data);
            for (let item in this.state.data['settlements'] ){
                this.state.selects['settlements']
                    .append(
                        new Option(
                            this.state.data['settlements'][item].name,
                            this.state.data['settlements'][item].id,
                            false,
                            this.state.data['settlements'][item].id == id ? true : false)
                    )
            }
        })
    }

    getAllData(){
        $.ajax({
            type: 'GET',
            url: '/api/handbook/client/technician',
        }).done((data) => {
            this.state.data['receiving'] = data;
            console.log(data);
            for (let item in this.state.data['receiving'] ){
                this.state.selects['receiving']
                    .append(
                        new Option(
                            this.state.data['receiving'][item].full_name,
                            this.state.data['receiving'][item].id)
                    )
            }
        });

        $.ajax({
            type: 'GET',
            url: '/api/handbook/client/material',
        }).done((data) => {
            this.state.data['material_type'] = data;
            this.addOptionsMaterialType(this.state.selects['material_type'])
        });

        this.getRegions();
    }

    addOptionsMaterialUnits(select){
       let unit_id = '';

        this.state.data.material_type.forEach(
            (item) => {
                if(item.id == select.val()){
                    unit_id = item.unit_id
                }
            }
        );
        let url = '/api/handbook/client/unit-of-measurement/' + unit_id;
        $.ajax({
            type: 'GET',
            url: url,
        }).done((data) => {
            select.parent().parent().find('input.material-units').val(data.unit)
        });
    }

    addOptionsMaterialType(select){
        for (let item in this.state.data['material_type'] ){
            select.append(
                new Option(
                    this.state.data['material_type'][item].name,
                    this.state.data['material_type'][item].id)
            )
        }
    }

    initializeHandlers(){
        this.state.buttons.add_to_handbook.on('click',()=>{this.addToHandbookWarehouse()});
        this.state.buttons.load_from_handbook.on('click',() => {this.loadFromHandbookWarehouse()});
        this.state.buttons.add_equip.on('click',() => {this.addMaterials()});
        this.state.buttons.clear_canvas.on('click',() => {this.clearCanvas()});
        this.state.canvasContainer.on('click', e => {   if($(e.target).hasClass('canvas-back')){this.toggleCanvas()}});
        this.state.buttons.receive.on('click', ()=>{this.toggleCanvas(); this.state.imageType = 'receive';});
        this.state.buttons.transfer.on('click', ()=>{this.toggleCanvas(); this.state.imageType = 'transfer';});
        this.state.buttons.save_canvas.on('click', ()=>{this.saveCanvas()});
        this.state.buttons.submit.on('click',()=>{this.submit()});
        this.onlyNumberInput();
        this.state.selects.material_type.on('select2:select',(e)=>{this.addOptionsMaterialUnits(this.state.selects.material_type)})
        this.state.selects.region.on('change', ()=>{this.getCities()});
        this.state.selects.city.on('change', ()=>{this.getDistrict()});
        this.state.selects.district.on('change', ()=>{this.getSettlement()});
    }

    onlyNumberInput(){
        $('.only-number').on('keypress', function (e) {
            e = e || event;
            if (e.ctrlKey || e.altKey || e.metaKey) return;

            let chr = getChar(e);
            if (chr == null) return;

            if (chr < '0' || chr > '9') {
                return false;
            }
        });

        function getChar(event) {
            if (event.which == null) {
                if (event.keyCode < 32) return null;
                return String.fromCharCode(event.keyCode) // IE
            }

            if (event.which != 0 && event.charCode != 0) {
                if (event.which < 32) return null;
                return String.fromCharCode(event.which) // остальные
            }

            return null; // специальная клавиша
        }
    }

    saveCanvas(){
        if(this.state.imageType === 'receive'){
            this.state.output.receiveSignature = this.toBlob();
            this.state.images.receive.show().prop('src',this.state.canvas.toDataURL());
        }
        else if(this.state.imageType === 'transfer'){
            this.state.output.transferSignature =  this.toBlob();
            this.state.images.transfer.show().prop('src',this.state.canvas.toDataURL());
        }
        this.toggleCanvas();
        this.clearCanvas();

    }

    toBlob(){
        let ImageURL = this.state.canvas.toDataURL();
        let block = ImageURL.split(";");
        let contentType = block[0].split(":")[1];
        let realData = block[1].split(",")[1];
        return this.b64toBlob(realData,contentType);
    }

    b64toBlob(b64Data, contentType, sliceSize) {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;

        let byteCharacters = atob(b64Data);
        let byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            let slice = byteCharacters.slice(offset, offset + sliceSize);

            let byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            let byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }

        let blob = new Blob(byteArrays, {type: contentType});
        return blob;
    }

    toggleCanvas(){
        this.state.canvasContainer.toggleClass('active');
    }

    addToHandbookWarehouse(){
        if(this.state.inputs.adress.val() != ''){
            $.ajax({
                type: 'POST',
                url: '/api/handbook/client/regional-warehouse',
                data: {
                    name: this.state.inputs.adress.val()
                }
            }).done(data => {
                $('.address-success').fadeIn();
                setTimeout(function () {
                    $('.address-success').fadeOut();
                },2500)
            }).fail(data => {
                $('.address-fail').fadeIn();
                setTimeout(function () {
                    $('.address-fail').fadeOut();
                },2500)
            })
        }
    }

    loadFromHandbookWarehouse(){
        $.ajax({
            type: 'GET',
            url: '/api/handbook/client/regional-warehouse',
        }).done((data) => {
            this.state.data['loadedAddresses'] = data;
            this.state.wh_list.html('');
            let index = 0;
            for(let item in data){
                this.state.wh_list.append(
                    `<li data-dismiss="modal" style="cursor: pointer" class="wh-adress-vals" data-key="${index}">`+ data[item].address.name + '</li>'
                )
                index++;
            }

            $('.wh-adress-vals').on('click',(ev)=> {
                let data = this.state.data.loadedAddresses[ev.target.dataset.key];

               this.clearAddressSelect();
               this.state.inputs.name_of.val(data.address.name);
               this.state.inputs.address.val(data.address.address);
               this.getRegions(data.address.region_id);
               this.getCities(data.address.city_id,data.address.region_id);
               this.getDistrict(data.address.area_id,data.address.city_id);
               this.getDistrict(data.address.area_id,data.address.city_id);
            })
        });
    }

    clearAddressSelect(){
        this.state.selects.region.find('option').remove().val(null);
        this.state.selects.city.find('option').remove().val(null);
        this.state.selects.district.find('option').remove().val(null);
        this.state.selects.settlements.find('option').remove().val(null);
    }

    addMaterials(){
        const material_block = " <div class=\"material-container col-md-12\" style='margin-top: 10px'>\n" +
            "                                    <div class=\"col-xs-6 col-sm-5 col-md-2 col-lg-4\">\n" +
            "                                        <select  class=\"form-control material-type\" name=\"list\" >\n" +
            "                                        </select>\n" +
            "                                    </div>\n" +
            "                                    <div class=\"col-xs-6 col-sm-5 col-md-2 col-lg-2\">\n" +
            "                                        <input type=\"text \" class=\"material-units form-control\" value=\"кг\">\n" +
            "                                    </div>\n" +
            "                                    <div class=\"col-xs-6 col-sm-5 col-md-2 col-lg-2\">\n" +
            "                                        <input type=\"text\" class=\"form-control only-number\">\n" +
            "                                    </div>\n" +
            "                                    <button type='button' class='btn btn-danger delete-equip'>-</button>   \n"+
            "                                </div>";
        this.state.material_list.append(material_block);



        const materialType = this.state.material_list.find('.material-container:last-child select.material-type');
        materialType.select2();
        this.addOptionsMaterialType(materialType);
        materialType.on('select2:select',()=>{this.addOptionsMaterialUnits(materialType)});

        $(".delete-equip").on('click',(e)=>{
            $(e.target).parent().remove();
        });
        this.onlyNumberInput();
    }



    collectMaterials(){
        let output = [];
        this.state.material_list.find('.material-container').each(function () {
            output.push({
                id      :  $(this).find('select').val(),
                amount  :  $(this).find('input.only-number').val()
            })
        });
        console.log('output');
        return output;
    }

    submit() {

        // get the form data
        // there are many ways to get this data using jQuery (you can use the class or id also)

        let data = new FormData();
        const regional_warehouse = {
            region_id: this.state.selects.region.val(),
            city_id: this.state.selects.city.val(),
            area_id: this.state.selects.district.val(),
            settlement_id: this.state.selects.settlements.val(),
            name: this.state.inputs.name_of.val(),
            address: this.state.inputs.address.val()
        }
        data.append('number', $('input[name=number]').val());
        data.append('receiver_client_id', this.state.selects.receiving.val());
        data.append('regional_warehouse', JSON.stringify(regional_warehouse));
        data.append('transmitter_comment', $('#transfer-comment').val());
        data.append('receiver_comment', $('#receive-comment').val());
        data.append('materials',  JSON.stringify(this.collectMaterials()));
        data.append('transmitter_sign', this.state.output.transferSignature);
        data.append('receiver_sign', this.state.output.receiveSignature);

        //process the form
        $.ajax({
            type        : 'POST', // define the type of HTTP verb we want to use (POST for our form)
            url         : '/api/document/act-type/3/act', // the url where we want to POST
            data        : data, // our data object
            dataType    : 'json', // what type of data do we expect back from the server
            encode      : true,
            processData : false,
            contentType : false,
        })
        // using the done promise callback
            .done(function(data) {
                window.location.replace('/merchandiser/document/act/material-giving')
            }).fail( (data) => {
            this.showErrors(data);
        });

        // stop the form from submitting the normal way and refreshing the page

    }

    showErrors(data){
        this.state.alert.show();
        switch(JSON.parse(data.responseText).message){
            case 'Поле address обязательно для заполнения.':
                this.state.alert.html('Поле адресс склада обязательно для заполнения.');
                break;
            case 'Поле transmitter sign должно быть файлом.':
                this.state.alert.html('Добавьте росипись передающего');
                break;
            case 'Поле receiver sign должно быть файлом.':
                this.state.alert.html('Добавьте росипись принимающего');
                break;
            case 'Поле amount обязательно для заполнения.':
                this.state.alert.html('Заполните кол-во оборудования.');
                break;
            default:
                break;
        }
    }

}

$(document).ready(function () {
    new Form();
});




