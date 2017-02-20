(function( $ ){
  'use strict';

  var taglist     = [],
      allowed_tag = [],
      methods = {
        init : function( options ) {
            var settings = $.extend(true, {
                'type': '',
                'allowed_tag' : []
            }, options);
          
            console.log("settings", settings);
            
            taglist = [];
            //HTML構造化
            var html = methods.html_parse(this);
        
            //HTMLタグリスト生成
            methods.taglist_generate(html);
          
            console.log("taglist", taglist);

            if (settings.type){
                if (settings.type==="allowed"){
                    //許可タグ設定
                    allowed_tag = settings.allowed_tag;
                }
                
                console.log(settings.type);
                res = methods[settings.type]();
            }else{
                res = taglist;
            }
            
            return res;
        },

        /*
         * HTMLの構造化
         * @param {type} self
         * @returns {Array}
         */
        html_parse: function(self) {
          var $this = $(self);
          return $.parseHTML($this.val());
        },
        
        /*
         * HTMLタグリストの生成
         * @param object html HTMLオブジェクト
         */
        taglist_generate : function(html) {
          Object.keys(html).forEach(function (key) {
            if (html[key].tagName){
              var tag_data   = [],
                  tag        = html[key].tagName.toUpperCase(),
                  attributes = [];

              for(var i=0; i<html[key]['attributes'].length; i++){
                attributes[i] = html[key]['attributes'][i]['name'].toUpperCase();
              }

              tag_data = [tag, attributes];
              taglist.push(tag_data);

              if (html[key].childNodes.length>0){
                methods.taglist_generate(html[key].childNodes);
              }
            }
          });
        },
        
        /*
         * 許可されているタグのチェック
         * @return array error_tag 入力した許可タグ以外
         */
        allowed : function() {
            console.log("allowed start");
            var error_tag = [];
            Object.keys(taglist).forEach(function (key) {
                if (allowed_tag instanceof Array && allowed_tag){
                    var tag_check_flg = 0;
                    
                    for (var e=0; e<allowed_tag.length; e++){
                        //タグ名チェック
                        allowed_tag[e]['tag'] = allowed_tag[e]['tag'].toUpperCase();
                      
                        if (taglist[key][0]===allowed_tag[e]['tag']){        
                            tag_check_flg = 1;
                          
                            if (allowed_tag[e]['attribute'] instanceof Array && taglist[key][1] instanceof Array){
                                //属性チェック
                                for (var i=0; i<allowed_tag[e]['attribute'].length; i++){
                                    //大文字化
                                    allowed_tag[e]['attribute'][i] = allowed_tag[e]['attribute'][i].toUpperCase();
                                }
                                
                                for (var t=0; t<taglist[key][1].length; t++){
                                    if (allowed_tag[e]['attribute'].indexOf(taglist[key][1][t])===-1){
                                        error_tag.push(taglist[key]);
                                        break;
                                    }
                                }
                            }
                        }
                    }
                    
                    if (tag_check_flg==0){
                        //許可タグではない
                        error_tag.push(taglist[key]);
                    }
                }
            });
            
            return error_tag;
        }
      };

  $.fn.htmltagchecker = function( method ) {
    if ( methods[method] ) {
      return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return methods.init.apply( this, arguments);
    } else {
      $.error( 'Method ' +  method + ' does not exist on jQuery.tagcheck' );
    }
  };
})( jQuery );