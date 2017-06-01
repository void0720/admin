
$(function() {
    var tag = false,
        item = $("a"),
        baseNum = $(".baseNum"),
        formula = $("#formula"),
        textarea = $("textarea");

        item.on('click',function() {
            switch ($(this).text()) {
                case "结算":
                    if (/^[0-9]*$/.test(baseNum.val())) {
                        tag || formula.text(formula.text() + baseNum.val());
                        baseNum.val(eval(formula.text().replace(/\%\/\*\-\+/, '')));
                        baseNum.val(baseNum.val().substr(0, 10).replace("NaN", 0));
                        tag = true;
                    }else{
                        return;
                    }
                    break;
                case "c":
                    baseNum.val(0);
                    formula.text("");
                    break;
                case "%":
                    count("%")
                    break;
                case "÷":
                    count("/")
                    break;
                case "×":
                    count("*")
                    break;
                case "-":
                    count("-")
                    break;
                case "+":
                    count("+")
                    break;
                case "=":
                    if (/^[0-9]*$/.test(baseNum.val())) {
                        tag || formula.text(formula.text() + baseNum.val());
                        baseNum.val(eval(formula.text().replace(/\%\/\*\-\+/, '')));
                        baseNum.val(baseNum.val().substr(0, 10).replace("NaN", 0));
                        tag = true;
                    }else{
                        return;
                    }
                    break;
                case ".":
                    if (baseNum.val().search(/[\.\%\/\*\-\+]/) != -1)
                        break;
                default:
                    tag && (baseNum.val(0), formula.text(""), tag = false);
                    baseNum.val().length < 10 && (baseNum.val((baseNum.val() + $(this).text()).replace(/^[0\%\/\*\-\+](\d)/, "$1")));
            }
            textarea.scrollTop(textarea[0].scrollHeight - textarea.height());
        }); 

    function count(a) {

        if (tag) {
            formula.html(baseNum.val() + a);
            baseNum.val(a);
            tag = false;
        } else {
            /[\%\/\*\-\+]$/.test(baseNum.val()) || (formula.text(formula.text() + baseNum.val()));
            baseNum.val(a);
            /[\%\/\*\-\+]$/.test(formula.text()) || (formula.text(formula.text() + baseNum.val()));
            formula.text(formula.text().slice(-1) != a ? formula.text().replace(/.$/, a) : formula.text())
        }
    }
    
});