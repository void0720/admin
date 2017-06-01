$(function(){
    inputAll({
        "inputSup": "input[name='sup']",
        "inputSub": "input[s='sub']"
    });
    $(".getVal").click(function(event) {
        $("#fileTree input:checked").each(function(index, el) {
            $(".inTreeVal div").append($(el).val()+"----")
        });
        $(".inTreeVal div").append("<br>")
    });
});

function inputAll(config) {
    $(document).on("click", config.inputSup, function() {
        tagIpt = $(this).parent().siblings().children().find(config.inputSub);
        if ($(this).is(":checked")) {
            tagIpt.prop("checked", true);
        } else {
            tagIpt.prop("checked", false);
        }
    });
    $(document).on("click", config.inputSub, function() {
        var subCheck = $(this).parent('.tree').parent('ul').find('input:checked').length;
        var tagIpt = $(this).parent('.tree').parent('ul').siblings('.treeMenu').children("input");
        if (subCheck>0) {
            tagIpt.prop("checked", true);
        } else {
            tagIpt.prop("checked", false);
        }
    });
}
