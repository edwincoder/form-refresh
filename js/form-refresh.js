/**
 * author edwin
 * mail:edwincoder@163.com
 *
 * 页面刷新表单值保存
 */
(function($){
    $.fn.serializeJson=function(){
        var serializeObj={};
        var array=this.serializeArray();
        $(array).each(function(){
            if(serializeObj[this.name]){
                if($.isArray(serializeObj[this.name])){
                    serializeObj[this.name].push(this.value);
                }else{
                    serializeObj[this.name]=[serializeObj[this.name],this.value];
                }
            }else{
                serializeObj[this.name]=this.value;
            }
        });
        return serializeObj;
    };

})(jQuery);


$(function(){
    $('form').each(function(){
        var id = $(this).attr("id");

        $(this).submit(function(){
            clearForm(id);
        });
    });
});

window.onload = function(){
    decodeForm();
}

window.onunload = function(){
    encodeForm();
}

function encodeForm()
{
    var storedata = getStoreForm();
    if (storedata == 'clear') {
        storeForm('');
        return false;
    }
    var jsonObj = {};
    jsonObj.forms = [];
    $("form").each(function(){
        var id = $(this).attr('id');
        if (id === undefined) {
            return false;
        }
        var obj = $(this).serializeJson();
        obj.id = id;
        jsonObj.forms.push(obj);
    });

    str = JSON.stringify(jsonObj);
    storeForm(str);
}

function clearForm(id)
{
    //document.getElementById(id).reset();
    storeForm('clear');
}

function storeForm(str)
{
    if (window.localStorage) {
        window.localStorage.formRefresh = str;
    } else {
        window.name = str;
    }
}

function getStoreForm()
{
    var str = '';
    if (window.localStorage) {
        str = window.localStorage.formRefresh;
    } else {
        str = window.name;
    }
    return str;
}

function decodeForm()
{
    var storedata = getStoreForm();
    if (!/{/.test(storedata)) {
        return false;
    }
    var obj = $.parseJSON(storedata);
    if (obj.forms == undefined) return false;

    for(i in obj.forms) {
        var form = obj.forms[i];
        var id = form.id;
        for(name in form) {
            value = form[name];
            if (name === 'id') {
                return false;
            }
            var input = $("form[id='"+ id +"'] [name='" + name + "']");
            var type = input.attr('type') == undefined ? input[0].tagName.toLowerCase():input.attr('type');

            switch(type) {
                case 'text':case 'textarea':
                input.length? input.val(value):null;
                break;
                case 'hidden':
                    if (name != '_token') {
                        input.length? input.val(value):null;
                    }
                    break;
                case 'radio':
                    var radio = input.filter('[value="'+value+'"]');
                    radio.length ? radio.attr("checked", "checked"): null;
                    break;
                case 'checkbox':
                    for(k in value) {
                        v = value[k];
                        var checkbox = input.filter('[value="'+v+'"]');
                        checkbox.length ? checkbox.attr("checked", "checked"): null;
                    };
                    break;
                default:
                //console.log(type);
            }
        };
    };
}