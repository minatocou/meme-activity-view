define(function(t){var n=t("../blend"),o=t("../../common/lib"),i=t("../Control"),e=t("../Dialog"),l=function(t,o,l,c){return i.prototype.setProperties.call(this,{content:t,title:o}),e.call(this,{content:t,title:o,afterContent:'<input type="text" class="modal-prompt-input">',buttons:[{text:n.configs.dialogBtnCancel,onclick:function(){c&&c($(this.main).find(".modal-prompt-input").val())}},{text:n.configs.dialogBtnOK,bold:!0,onclick:function(){l&&l($(this.main).find(".modal-prompt-input").val())}}]}),this};return o.inherits(l,e),l.prototype.title=n.configs.dialogTitle,l.prototype.content="",l});