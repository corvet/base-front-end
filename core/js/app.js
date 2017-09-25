(function($){
    var app = {
          pages:[]
        , blocks:[]
        , waitBlocks:[]
        , incList:[]
        , setSchema : function(schema) {
            // Фиксируем разрешенные нам страницы и блоки
            schema.pages.forEach(function(item, i, arr){
                app.pages[item] = item;
            });
            schema.blocks.forEach(function(item, i, arr){
                app.blocks[item] = item;
            });
        }
        , loadPage : function() {
            var p = app.getUrlVars()["p"];
            if (typeof(p) ==='string') {
                if (typeof(app.pages[p]) === 'string') {
                    page = 'core/html/' + p + '.html';
                } else {
                    page = 'core/html/page_error.html';
                }
            } else {
                page = 'core/html/page_home.html';
            }
            console.log(page);
            $.ajax({
                url: page,
                dataType: 'html',
                success: function(htmlData) {
                    $("body").html(htmlData);
                    var a = $('.include_block');
                    a.each(function(i, elem){
                        console.log(elem);
                        $(elem).removeClass('include_block');
                        var block_name = elem.className;
                        console.log(block_name);
                        $(elem).addClass('apendix_block');
                        if (typeof(app.blocks[block_name]) === 'string') {
                            app.waitBlocks[block_name] = block_name;
                            delete app.blocks[block_name]; // Разрешаем загружать блок только одмн раз!
                            console.log('Блок валидный!');

                            var patchBlock = function(htmlText) {
                                $(this.elem).before(htmlText);
                                $(this.elem).remove();
                                console.log(block_name);
                                delete app.waitBlocks[block_name];
                                console.log(app.waitBlocks.length.toString());

                            }
                            app.incList[block_name] = {
                                  'elem' : elem
                            }
                            var successPatchBlock = patchBlock.bind(app.incList[block_name]);

                            blockUrl = 'core/html/' + block_name + '.html';

                            $.ajax({
                                url: blockUrl,
                                dataType: 'html',
                                success: successPatchBlock
                                });

                        }
                    });
                    console.log('ACCA!');
                }
            });
        }
        , fillPage : function() {
            console.log('fillPage');
        }
        , getUrlVars : function() {
            // https://ruseller.com/lessons.php?rub=29&id=1030
            // Пример вызова для такой страницы: http://somesite.com/index.php?id=123&page=home
            // var id = getUrlVars()["id"];
            // var page = getUrlVars()["page"];
            var vars = {};
            var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
                vars[key] = value;
            });
            return vars;
        }
    }

    $(document).ready(function () {
        console.log('Hello world!');
/*        $("#header").load('txt/header.html');
        $("#breadcrumb").load('txt/breadcrumb.html');
        $("#content").load('txt/content.html');
        $("#sidebar_first").load('txt/sidebar_first.html');
        $("#my_search").load('txt/my_search.html');        */


        $.ajax({
          url: 'core/html/schema.json',
          dataType: 'json',
          success: function(jsondata) {
            app.setSchema(jsondata);
            app.loadPage();
            //app.fillPage();
            /*
            console.log(app);
            $.ajax({
                url:'core/html/page_home.html',
                dataType: 'html',
                success: function(htmlData) {
                    $("body").html(htmlData);
                }

            });
            */

          }
        });

    });
})(jQuery);