/**
 * Created by memebox on 16/10/15.
 */
if($(".countdown").length){
    $(".countdown").each(function(index , ele){
        !function(){
            var started = moment($(ele).data("from")).toDate().getTime()
            var end = moment($(ele).data("to")).toDate().getTime()
            var now = $("body").data("now");
            if (started && end) {
                var countDown = {
                    data: {
                        day: '',
                        hour: '',
                        minute: '',
                        second: ''
                    },
                    time: function (t, state) {
                        var me = this;
                        var leftTime = setInterval(function () {
                            t--;
                            me.checkTime(t);
                            me.render(me.data);
                            if (t == 0) {
                                clearInterval(leftTime);
                                if (state == 'not') {
                                    Started(end - started);
                                } else if (state == 'started') {
                                    Over();
                                }
                            }
                        }, 1000);
                    },
                    checkTime: function (t) {
                        var me = this;
                        me.data = {
                            second: t % 60,
                            minute: Math.floor(t / 60) % 60,
                            hour: Math.floor(t / 60 / 60) % 24,
                            day: Math.floor(t / 60 / 60 / 24)

                        };


                        me.data.day < 10 && (me.data.day = '0' + me.data.day);
                        me.data.hour < 10 && (me.data.hour = '0' + me.data.hour);
                        me.data.minute < 10 && (me.data.minute = '0' + me.data.minute);
                        me.data.second < 10 && (me.data.second = '0' + me.data.second);
                    },
                    render: function (obj) {
                        for (var k in obj) {
                            obj[k] = obj[k].toString();
                            $( ele ).find( '.' + k + ' .card span' ).each(function(index , ele){
                                $(this).text(obj[k][index])
                            })
                            
                        }
                    },
                    init: function (t, state) {
                        var me = this;
                        me.checkTime(Math.ceil(t / 1000));
                        me.render(me.data);
                        me.time(Math.ceil(t / 1000), state);
                    }
                };

                function Started(t) {
                    $(ele).removeClass('active-not')  ;
                    $(ele).addClass('active-started')  ;
                    countDown.init(t, 'started');
                }

                function Over(t) {
                    $(ele).removeClass('active-not')  ;
                    $(ele).removeClass('active-started')  ;
                    $(ele).addClass('active-over')  ;
                }

                function ActiveNot(t) {
                    $(ele).addClass('active-not')  ;
                    countDown.init(t, 'not');
                }

                if (now < started) {
                    //没有开始
                    ActiveNot(started - now, 'not');
                } else if (now > end) {
                    //结束
                    Over();
                } else if (now < end && now > started) {
                    //开始
                    Started(end - now, 'started');
                }
            }
        }()

    })
}
