$(function() {
        var container = $('#container');
        var loadgif = $('#loader');
        var iwidth = 200; //列宽
        var is = 10; //间隔
        var iOuterWidth = iwidth + is; //列实际宽
        var iCells = 0; //总列
        var sUrl = 'http://www.wookmark.com/api/json/popular?callback=?';
        var arrT = [];
        var arrL = []; //列里的值
        var iPage = 0;
        var iBth = true;

        function setCells() {
            iCells = Math.floor($(window).innerWidth() / iOuterWidth);
            if (iCells < 3) {
                iCells = 3;
            }
            if (iCells > 9) {
                iCells = 9;
            }
            // document.title = '瀑布流'+iCells;
            container.css('width', iOuterWidth * iCells - is);
        };
        setCells();

        for (var i = 0; i < iCells; i++) {
            arrT.push(0);
            arrL.push(i * iOuterWidth);
        };
        //console.log(arrL);

        function getMin() {
            var iv = arrT[0];
            var _index = 0;
            for (var i = 0; i < arrT.length; i++) {
                if (arrT[i] < iv) {
                    iv = arrT[i];
                    _index = i;
                }
            }
            return _index;
        }


        function getData() {
            if (iBth) {
                iBth = false;
                loadgif.show();
                $.getJSON(sUrl, 'Page=' + iPage, function(data) {
                    //console.log(data);
                    $.each(data, function(index, obj) {
                        var oImg = $('<img/>');
                        oImg.attr('src', obj.preview);
                        container.append(oImg);
                        var iHeight = iwidth / obj.width * obj.height;

                        oImg.css({
                            width: iwidth,
                            height: iHeight
                        });

                        //获取arrT最小值
                        var iMinindex = getMin();

                        //设置定位
                        oImg.css({
                            left: arrL[iMinindex],
                            top: arrT[iMinindex]
                        });
                        arrT[iMinindex] += iHeight + 10;
                        loadgif.hide();
                        iBth = true;

                    });
                });
            }
        }

        getData();
        $(window).on('scroll', function() {
            var iH = $(window).scrollTop() + $(window).innerHeight();
            var iMinIndex = getMin();
            if (arrT[iMinIndex] + container.offset().top < iH) {
                iPage++;
                getData();

            }
        });
        $(window).on('resize', function() {
            var ioldCells = iCells;

            setCells();
            var iH = $(window).scrollTop() + $(window).innerHeight();
            var iMinIndex = getMin();
            if (arrT[iMinIndex] + container.offset().top < iH) {
                iPage++;
                getData();

                if (ioldCells == iCells) {
                    return;
                }
                arrT = [];
                arrL = [];
                for (var i = 0; i < iCells; i++) {
                    arrT.push(0);
                    arrL.push(i * iOuterWidth);
                }
                var aImg = container.find('img');
                aImg.each(function() {
                    var iMinIndex = getMin();
                    // $(this).css({
                    //     left: arrL[iMinIndex],
                    //     top: arrT[iMinIndex]
                    // });

                    $(this).animate({
                        left: arrL[iMinIndex],
                        top: arrT[iMinIndex]
                    });


                    arrT[iMinindex] += $(this).height() + 10;


                })

            };





        });
    });