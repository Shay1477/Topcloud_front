var customRangeValues = {
    'rangeSpeedValues': [10, 20, 30, 50, 100],
    'rangeDiskValues': [64, 128, 256, 512, 1024, 2048, 4096],
    'rangeVCPUValues': [2, 4, 8, 16, 32, 64, 96],
    'rangeVCPUShareValues': ['20%', '50%', '100%'],
};
$(document).ready(function () {
    //меню
    $(document).on('click', ".lines-button", function () {
        if ($(this).hasClass('close')) {
            $(this).removeClass('close');
            $('.mobileMenu').slideUp(300);
        } else {
            $(this).addClass('close');
            $('.mobileMenu').slideDown(300);
        }
    });

    $(window).scroll(function () {
        if ($(document).scrollTop() != 0) {
            $("header").addClass('headerScroll');
        } else {
            $("header").removeClass('headerScroll');
        }
    });
    //возможность оставить чекбокс без выбора
    $(document).on('click', '.specificationBlock__toggler input[type=radio]:not(.required):checked+label', function (e) {
        e.preventDefault();
        $('#' + $(this).attr('for')).prop('checked', false);
        $('#' + $(this).attr('for')).trigger('change');
    })
    if ($('.regimeToggler').length > 0) {
        $(document).on('click', '.regimeToggler', function () {
            if ($(this).hasClass('active')) {
                $(this).removeClass('active');
                $(this).html('Расширенный выбор')
            } else {
                $(this).addClass('active');
                $(this).html('Простой выбор')
            }
            $('.extended').toggle(300);
            configuratorProvidersCheck();
            configuratorCalc();
        });
    }
    if ($('.partnersSlider').length > 0) {
        $('.partnersSlider').slick({
            infinite: true,
            speed: 300,
            slidesToShow: 5,
            slidesToScroll: 1,
            dots: false,
            arrows: false,
            centerMode: true,
            responsive: [{
                breakpoint: 1399,
                settings: {
                    slidesToShow: 3,
                }
            }]
        });
    }
    if ($('.js-range-slider').length > 0) {
        $(".js-range-slider:not(.js-range-slider_custom)").ionRangeSlider();
        if ($('.js-range-slider_custom-speed').length > 0) {
            $(".js-range-slider_custom-speed").ionRangeSlider({
                type: "single",
                values: customRangeValues.rangeSpeedValues,
                grid: true,
            });
        }
        if ($('.js-range-slider_custom-vcpuShare').length > 0) {
            $(".js-range-slider_custom-vcpuShare").ionRangeSlider({
                type: "single",
                values: customRangeValues.rangeVCPUShareValues,
                grid: true,
            });
        }
        if ($('.js-range-slider_custom-disk').length > 0) {
            $(".js-range-slider_custom-disk").ionRangeSlider({
                type: "single",
                values: customRangeValues.rangeDiskValues,
                grid: true,
            });
        }
        if ($('.js-range-slider_custom-vCPU').length > 0) {
            $(".js-range-slider_custom-vCPU").ionRangeSlider({
                type: "single",
                values: customRangeValues.rangeVCPUValues,
                grid: true,
            });
        }

        //изменение textinput
        $(document).on('change', '.specificationBlock__amount:not(.specificationBlock__amount_custom)', function () {
            let value = $(this).val();

            //смена ренжинпут
            $(this).addClass('changed');
            let range = $(this).closest('.specificationBlock').find('.specificationBlock__amount-range').data("ionRangeSlider");
            range.update({
                from: value
            });
            $(this).removeClass('changed');

            /*//смена радиоинпут
            if ($(this).closest('.specificationBlock').find('.specificationBlock__toggler').length > 0) {
                let diff = 999999;
                let from = 0;
                $(this).closest('.specificationBlock').find('.specificationBlock__toggler input').each(function (index, element) {
                    if (Math.abs(value - $(this).val()) <= diff) {
                        diff = Math.abs(value - $(this).val());
                        from = index;
                    } else {
                        from = index - 1;
                        return false;
                    }
                });
                $(this).closest('.specificationBlock').find('.specificationBlock__toggler input').eq(from).prop('checked', true);
            }*/
        });
        //изменение textinput связанного с ренжинпут с определенными значениями
        $(document).on('change', '.specificationBlock__amount_custom', function () {
            let value = $(this).val();
            let key = $(this).attr('data-key');
            let from = 0;
            let diff = 999999;
            for (let i = 0; i < customRangeValues[key].length; i++) {
                if (Math.abs(value - customRangeValues[key][i]) <= diff) {
                    diff = Math.abs(value - customRangeValues[key][i]);
                    from = i;
                } else {
                    from = i - 1;
                    break;
                }
            }
            $(this).addClass('changed');
            let range = $(this).closest('.specificationBlock').find('.specificationBlock__amount-range').data("ionRangeSlider");
            range.update({
                from: from
            });
            $(this).removeClass('changed')
        });

        //изменение ренжинпут
        $(document).on('change', '.specificationBlock__amount-range:not(.specificationBlock__amount-range-no-text)', function () {
            let value = $(this).val();
            //смена textinput
            $(this).closest('.specificationBlock').find('.specificationBlock__amount:not(.changed)').val(value);

            /*//смена радиоинпут
            if ($(this).closest('.specificationBlock').find('.specificationBlock__toggler').length > 0) {
                let diff = 999999;
                let from = 0;
                $(this).closest('.specificationBlock').find('.specificationBlock__toggler input').each(function (index, element) {
                    if (Math.abs(value - $(this).val()) <= diff) {
                        diff = Math.abs(value - $(this).val());
                        from = index;
                    } else {
                        from = index - 1;
                        return false;
                    }
                });
                $(this).closest('.specificationBlock').find('.specificationBlock__toggler input').eq(from).prop('checked', true);
            }*/
        });

        /*//изменение радиоинпут
        $(document).on('change', '.specificationBlock__toggler input', function () {
            let value = $(this).val();
            //смена textinput
            $(this).closest('.specificationBlock').find('.specificationBlock__amount').val(value);

            //смена ренжинпут
            let range = $(this).closest('.specificationBlock').find('.specificationBlock__amount-range').data("ionRangeSlider");
            range.update({
                from: value
            });
        });*/
    }
    if ($('#paymentPeriod').length > 0) {
        $('#paymentPeriod').select2({
            minimumResultsForSearch: -1
        });
    }

    /*configurator*/
    if ($('.duplicateBtn').length > 0) {
        $(document).on('click', '.duplicateBtn', function () {
            let target = $(this).attr('data-duplicate');
            var length = $('[data-duplication="' + target + '"]').length;

            $('[data-duplication="' + target + '"]').eq(length - 1).find('.js-range-slider:not(.js-range-slider_custom)').each(function () {
                let range = $(this).data("ionRangeSlider");
                range.destroy();
            })

            let elem = $('[data-duplication="' + target + '"]').eq(length - 1).clone();
            elem.find('input').each(function () {
                let name = $(this).attr('name');
                name = name.replace(length, length + 1);
                $(this).attr('name', name);
                if ($(this).attr('id')) {
                    let id = $(this).attr('id');
                    id = id.replace(length, length + 1);
                    $(this).attr('id', id);
                }
            })
            elem.find('label').each(function () {
                if ($(this).attr('for')) {
                    let label = $(this).attr('for');
                    label = label.replace(length, length + 1);
                    $(this).attr('for', label);
                }
            });
            elem.insertBefore($(this));

            $('[data-duplication="' + target + '"]').eq(length - 1).find('.js-range-slider:not(.js-range-slider_custom)').each(function () {
                $(this).ionRangeSlider();
            });
            elem.find('.js-range-slider:not(.js-range-slider_custom)').each(function () {
                $(this).ionRangeSlider();
            });
            if ($('.configurator').length > 0) {
                configuratorProvidersCheck();
                configuratorCalc();
            }
            if ($('.cybernets').length > 0) {
                cybernetsCalc();
            }
        });
    }
    if ($('.configurator').length > 0) {
        //тип диска
        var diskTypeSettings = {
            'NLSAS': [0.3, true],
            'SAS': [1, false],
            'SSD': [10, false],
            'nVME': [100, false],
        };
        $(document).on('change', '.disk-type input', function () {
            let diskType = $(this).closest('.specificationBlock').find('[type="radio"]:checked').val();
            if (diskTypeSettings[diskType][0] != '') {
                $(this).closest('.specificationBlock').find('.specificationBlock__amount').val(diskTypeSettings[diskType][0]);
                if (diskTypeSettings[diskType][1]) {
                    $(this).closest('.specificationBlock').find('.specificationBlock__amount').prop('disabled', true);
                }
            }
        });
        if ($('input[name="remoteType"]').length > 0) {
            $(document).on('change', 'input[name="remoteType"]', function () {
                if ($(this).val() == 'RDP') {
                    $('.rw-description__block_vdi').addClass('rw-description__block_inactive');
                    $('.rw-description__block_rdp').removeClass('rw-description__block_inactive');
                    if (!$('.regimeToggler').hasClass('active')) {
                        $('.extended').slideUp(300);
                    }
                    $('.regimeToggler').slideDown(300);
                } else {
                    $('.rw-description__block_vdi').removeClass('rw-description__block_inactive');
                    $('.rw-description__block_rdp').addClass('rw-description__block_inactive');
                    $('.regimeToggler').slideUp(300);
                    $('.extended').slideDown(300);
                }
            });
        }




        //расчет суммы
        if ($('.rw').length > 0) {
            var remoteTypeCoefficient = {
                'RDP': 1,
                'VDI': 1.1,
            }
            var remoteBasePrice = 10000;
        }
        var vCPUBasePrice = 10;
        var vRAMGBBasePrice = 10;
        var vGPUBasePrice = 10;
        var diskTypeCoefficient = {
            'NLSAS': 1,
            'SAS': 1.1,
            'SSD': 1.2,
            'nVME': 1.3,
        };
        var diskGbBasePrice = 10;
        var diskIOPSBasePrice = 10;
        var extIPBasePrice = 100;
        var speedPrice = {
            '10': 300,
            '20': 400,
            '30': 500,
            '50': 600,
            '100': 800,
        };
        var guaranteedSpeedPrice = 200;
        var addServicePrices = {
            'soft': 1000,
            'testing': 1100,
            'consultation': 1200,
            'reservecopy': 1300,
            'directprovider': 1400,
            'administrating': 1500,
        };
        //var basePrice = 5000;
        function configuratorCalc() {
            var remoteTypeCoef = 1;
            var placesAmount = 1;
            //var vendor = $('[name="vendor"]:checked').val();
            if ($('.rw').length > 0) {
                var remote = $('[name="remoteType"]:checked').val();
                remoteTypeCoef = remoteTypeCoefficient[remote];
                placesAmount = $('[name="rwAmount"]').val();
            }
            if (($('.rw').length > 0) && (!$('.regimeToggler').hasClass('active')) && ($('.rw-description__block_vdi').hasClass('rw-description__block_inactive'))) {
                sum = placesAmount * remoteBasePrice;
                $('.sumBlock__row.remoteBasePrice .sumblock-row__text').html('Стандартное удаленное рабочее место x' + placesAmount);
                $('.sumBlock__row.remoteBasePrice .sumblock-row__price').html((remoteBasePrice* placesAmount * remoteTypeCoef).toFixed(2) + ' Р');
                $('.sumBlock__row:not(.remoteBasePrice)').slideUp(300);
                $('.sumBlock__row.remoteBasePrice').slideDown(300);
            } else {
                $('.sumBlock__row:not(.remoteBasePrice):not(.slided)').slideDown(300);
                $('.sumBlock__row.remoteBasePrice').slideUp(300);
                var vcpuAmount = $('[name="VCPUAmount"]').val();
                //var maxVCPU=$('[name="maxVCPU"]:checked').val();
                var VRAMAmount = $('[name="VRAMAmount"]').val();
                if($('[name="vGPUAmount"]').length>0){
                    var vGPUAmount = $('[name="vGPUAmount"]').val();
                }else{
                    var vGPUAmount = 0;
                }
                //var maxVRAM=$('[name="maxVRAM"]:checked').val();
                var disksSum = 0;
                var disksIOPSSum = 0;
                var disksGB = 0;
                var diskText = '';
                $('.diskBlock').each(function () {
                    var diskamount = +$(this).find('.specificationBlock__amount_disk').val()
                    disksSum = disksSum + diskamount * diskGbBasePrice;
                    disksIOPSSum = disksIOPSSum + (diskIOPSBasePrice * $(this).find('.specificationBlock__amount_diskIOPS').val() * diskTypeCoefficient[$(this).find('[type="radio"]:checked').val()]);
                    if (diskamount != 0) {
                        disksGB = disksGB + diskamount;
                    }
                });
                var diskText = 'Стандартное сетевое хранилище ' + disksGB + ' GB' + ', ' + $('.diskBlock').length + ' IOPS дисков';
                var extIPAmount = $('[name="extIPAmount"]').val();
                var speedAmount = $('[name="speedAmount"]').val();
                var guaranteedSpeed = $('[name="guaranteedSpeed"]:checked').val();
                var addServicesSum = 0;
                $('.additionals input').each(function () {
                    if ($(this).is(':checked')) {
                        addServicesSum = addServicesSum + addServicePrices[$(this).attr('name')];
                    }
                });

                var sum = (vCPUBasePrice * vcpuAmount + vRAMGBBasePrice * VRAMAmount + vGPUBasePrice * vGPUAmount + disksSum + disksIOPSSum) * placesAmount * remoteTypeCoef + extIPBasePrice * extIPAmount + speedPrice[speedAmount] + guaranteedSpeed * guaranteedSpeedPrice;

                $('.sumBlock__row.vCPUBasePrice .sumblock-row__text').html('Intel Ice Lake. vCPU x' + vcpuAmount);
                $('.sumBlock__row.vCPUBasePrice .sumblock-row__price').html((vCPUBasePrice * vcpuAmount* placesAmount * remoteTypeCoef).toFixed(2) + ' Р');

                $('.sumBlock__row.vRAMGBBasePrice .sumblock-row__text').html('Intel Ice Lake. RAM x' + VRAMAmount);
                $('.sumBlock__row.vRAMGBBasePrice .sumblock-row__price').html((vRAMGBBasePrice * VRAMAmount* placesAmount * remoteTypeCoef).toFixed(2) + ' Р');

                if(vGPUAmount >=0){
                    $('.sumBlock__row.vGPUBasePrice .sumblock-row__text').html('Intel Ice Lake. VGPU x' + vGPUAmount);
                    $('.sumBlock__row.vGPUBasePrice .sumblock-row__price').html((vGPUBasePrice * vGPUAmount* placesAmount * remoteTypeCoef).toFixed(2) + ' Р');
                }

                $('.sumBlock__row.disksSum .sumblock-row__text').html(diskText);
                $('.sumBlock__row.disksSum .sumblock-row__price').html(((disksSum + disksIOPSSum)* placesAmount * remoteTypeCoef).toFixed(2) + ' Р');

                $('.sumBlock__row.extIPBasePrice .sumblock-row__text').html('Внешний IP x' + extIPAmount);
                $('.sumBlock__row.extIPBasePrice .sumblock-row__price').html((extIPBasePrice * extIPAmount).toFixed(2) + ' Р');

                $('.sumBlock__row.speedPrice .sumblock-row__text').html('Скорость ' + speedAmount + ' Mbit/s');
                $('.sumBlock__row.speedPrice .sumblock-row__price').html((speedPrice[speedAmount]).toFixed(2) + ' Р');

                if (guaranteedSpeed != 0) {
                    $('.sumBlock__row.guaranteedSpeedPrice .sumblock-row__text').html('Гарантированная скорость');
                    $('.sumBlock__row.guaranteedSpeedPrice .sumblock-row__price').html((guaranteedSpeed * guaranteedSpeedPrice).toFixed(2) + ' Р');
                    $('.sumBlock__row.guaranteedSpeedPrice').slideDown(300);
                    $('.sumBlock__row.guaranteedSpeedPrice').removeClass('slided');
                } else {
                    $('.sumBlock__row.guaranteedSpeedPrice').slideUp(300);
                    $('.sumBlock__row.guaranteedSpeedPrice').addClass('slided');
                }
                if ($('.additionals :checkbox:checked').length > 0) {
                    $('.sumBlock__row.additionals').slideDown(300);
                    $('.sumBlock__row.additionals').removeClass('slided');
                } else {
                    $('.sumBlock__row.additionals').slideUp(300);
                    $('.sumBlock__row.additionals').addClass('slided');
                }
            }
            if ($('.rw').length > 0) {
                $(".sumBlock__final-price").html(sum.toFixed(2) + ' ₽<span>/мес</span>');
            } else {
                $(".sumBlock__final-price").html(sum.toFixed(2) + ' ₽');
            }
        }
        var oProviders = {
            'Cloud4y': {
                'cities': ['Санкт-Петербург', 'Екатеринбург', 'Сочи', 'Новосибирск'],
                'os': ['Linux', 'Windows'],
                'maxVCPU': '',
                'maxVRAM': '',
                'speed': '',
            },
            'Selectel': {
                'cities': ['Санкт-Петербург', 'Екатеринбург', 'Сочи', 'Новосибирск'],
                'os': ['Linux', 'Windows'],
                'maxVCPU': '',
                'maxVRAM': '',
                'speed': '',
            },
            'Cloud': {
                'cities': ['Москва', 'Санкт-Петербург', 'Екатеринбург', 'Сочи', 'Новосибирск'],
                'os': ['Linux'],
                'maxVCPU': '',
                'maxVRAM': '',
                'speed': '',
            },
            'DataLine': {
                'cities': ['Москва', 'Санкт-Петербург', 'Екатеринбург', 'Сочи', 'Новосибирск'],
                'os': ['Linux', 'Windows'],
                'maxVCPU': '16',
                'maxVRAM': '',
                'speed': '',
            },
            'Rostelecom': {
                'cities': ['Москва', 'Санкт-Петербург', 'Екатеринбург', 'Сочи', 'Новосибирск'],
                'os': ['Linux', 'Windows'],
                'maxVCPU': '',
                'maxVRAM': '512',
                'speed': '',
            },
            'Oncloud': {
                'cities': ['Москва', 'Санкт-Петербург', 'Екатеринбург', 'Сочи', 'Новосибирск'],
                'os': ['Linux', 'Windows'],
                'maxVCPU': '',
                'maxVRAM': '',
                'speed': '10',
            },
        }
        function configuratorProvidersCheck() {
            var city = $('[name="city"]:checked').val();
            var os = '';
            if (!$('.rw').length > 0) {
                os = $('[name="os"]:checked').val();
            }
            var maxVCPU = $('[name="maxVCPU"]:checked').val();
            var maxVRAM = $('[name="maxVRAM"]:checked').val();
            var speedAmount = $('[name="speedAmount"]').val();
            var guaranteedSpeed = $('[name="guaranteedSpeed"]:checked').val();
            Object.entries(oProviders).forEach(entry => {
                const [key, value] = entry;
                let disabled = false;
                if (!value.cities.includes(city)) {
                    disabled = true;
                }
                if ((!value.os.includes(os)) && (os != '')) {
                    disabled = true;
                }
                if ((+value.maxVCPU < +maxVCPU) && (value.maxVCPU != '')) {
                    disabled = true;
                }
                if ((+value.maxVRAM < +maxVRAM) && (value.maxVRAM != '')) {
                    disabled = true;
                }
                if ((guaranteedSpeed == '0') && (+value.speed < +speedAmount) && (value.speed != '')) {
                    disabled = true;
                }
                if (disabled) {
                    $('input[value="' + key + '"]').prop('disabled', true);
                    if ($('input[value="' + key + '"]').prop('checked') == true) {
                        if ($('input[name="vendor"]:not(:disabled)').length > 0) {
                            $('body').removeClass('alerted');
                            $('input[name="vendor"]:not(:disabled)').eq(0).prop('checked', true);
                        } else {
                            if (!$('body').hasClass('alerted')) {
                                alert('Вашим условиям не соответствует ни один провайдер');
                                $('body').addClass('alerted');
                            }
                        }
                    }
                } else {
                    $('input[value="' + key + '"]').prop('disabled', false);
                }
            });
        }
        $(document).on('change', '.configurator input', function () {
            //console.clear();
            configuratorProvidersCheck();
            configuratorCalc();
        });
        configuratorProvidersCheck();
        configuratorCalc();
    }


    /*cybernets*/
    if ($('.cybernets').length > 0) {
        //зависимость полей от типа
        $(document).on('change', 'input[name="masterType"]', function () {
            if ($('[name="masterType"]:checked').val() == 'regional') {
                $('.onlyRegional').slideDown(300);
            } else {
                $('.onlyRegional').slideUp(300);
            }
        });
        var masterTypePrice = {
            'zonal': 3960,
            'regional': 4960,
        }
        var masterTypeName = {
            'zonal': 'Managed Kubernetes. ZonalMaster-small',
            'regional': 'Managed Kubernetes. RegionalMaster-small',
        }
        var vCPUShareCoefficient = {
            '20%': 1,
            '50%': 1.5,
            '100%': 2,
        }
        var vCPUBasePrice = 10;
        var vRAMGBBasePrice = 10;
        var addServicePrices = {
            'vm': 1000,
            'publicIP': 1100,
        };
        var diskTypeCoefficient = {
            'hdd': 1,
            'ssd': 1.1,
        }
        var diskTypeName = {
            'hdd': 'Стандартное сетевоехранилище (HDD)',
            'ssd': 'Стандартное сетевоехранилище (SSD)',
        }
        var diskGbBasePrice = 10;
        var hostBasePrice = 100;
        var periodCoefficient = {
            'month': 1,
            'year': 10,//год по цене 10 месяцев
        }
        var basePrice = 3960;
        function cybernetsCalc() {
            var masterType = $('[name="masterType"]:checked').val();
            var vCPUShare = $('[name="vCPUShareRange"]').val();
            var vcpuAmount = $('[name="VCPUAmount"]').val();
            var VRAMAmount = $('[name="VRAMAmount"]').val();
            $('.additionals input').each(function () {
                if ($(this).is(':checked')) {
                    addServicePrices[$(this).attr('name')];
                }
            });
            var disksSum = 0;
            var diskText = '';
            var diskSSDCount = 0;
            var diskHDDCount = 0;
            $('.diskBlock').each(function () {
                disksSum = disksSum + $(this).find('.specificationBlock__amount_disk').val() * diskGbBasePrice * diskTypeCoefficient[$(this).find('[type="radio"]:checked').val()];
                if ($(this).find('[type="radio"]:checked').val() == 'hdd') {
                    diskHDDCount++;
                } else {
                    diskSSDCount++;
                }
            });
            if (diskSSDCount > 0) {
                diskText = diskTypeName['ssd'] + ' х' + diskSSDCount;
            }
            if (diskHDDCount > 0) {
                if (diskText != '') {
                    diskText = diskText + ', ';
                }
                diskText = diskText + diskTypeName['hdd'] + ' х' + diskHDDCount;
            }
            var hostAmount = 0;
            if ($('[name="masterType"]:checked').val() == 'regional') {
                hostAmount = $('[name="HostAmount"]').val();
            }
            var period = $("#paymentPeriod").val();

            var sum = (basePrice + masterTypePrice[masterType] + vCPUBasePrice * vcpuAmount * vCPUShareCoefficient[vCPUShare] + vRAMGBBasePrice * VRAMAmount + disksSum + hostAmount * hostBasePrice) * periodCoefficient[period];

            $('.sumBlock__row.basePrice .sumblock-row__price').html((basePrice * periodCoefficient[period]).toFixed(2) + ' Р');

            $('.sumBlock__row.masterTypePrice .sumblock-row__text').html(masterTypeName[masterType]);
            $('.sumBlock__row.masterTypePrice .sumblock-row__price').html((masterTypePrice[masterType] * periodCoefficient[period]).toFixed(2) + ' Р');

            $('.sumBlock__row.vCPUBasePrice .sumblock-row__text').html('Intel Ice Lake. ' + vCPUShare + 'vCPU x' + vcpuAmount);
            $('.sumBlock__row.vCPUBasePrice .sumblock-row__price').html((vCPUBasePrice * vcpuAmount * vCPUShareCoefficient[vCPUShare] * periodCoefficient[period]).toFixed(2) + ' Р');

            $('.sumBlock__row.vRAMGBBasePrice .sumblock-row__text').html('Intel Ice Lake. RAM x' + VRAMAmount);
            $('.sumBlock__row.vRAMGBBasePrice .sumblock-row__price').html((vRAMGBBasePrice * VRAMAmount * periodCoefficient[period]).toFixed(2) + ' Р');

            $('.sumBlock__row.disksSum .sumblock-row__text').html(diskText);
            $('.sumBlock__row.disksSum .sumblock-row__price').html((disksSum * periodCoefficient[period]).toFixed(2) + ' Р');

            if (hostAmount != 0) {
                $('.hostBasePrice').slideDown(300);
                $('.hostBasePrice').removeClass('slided');
                $('.sumBlock__row.hostBasePrice .sumblock-row__text').html('Хост x' + hostAmount);
                $('.sumBlock__row.hostBasePrice .sumblock-row__price').html((hostAmount * hostBasePrice * periodCoefficient[period]).toFixed(2) + ' Р');
            } else {
                $('.hostBasePrice').slideUp(300);
                $('.hostBasePrice').addClass('slided');
            }
            if ($('.additionals :checkbox:checked').length > 0) {
                $('.sumBlock__row.additionals').slideDown(300);
                $('.sumBlock__row.additionals').removeClass('slided');
            } else {
                $('.sumBlock__row.additionals').slideUp(300);
                $('.sumBlock__row.additionals').addClass('slided');
            }

            $(".sumBlock__final-price").html((sum * periodCoefficient[period]).toFixed(2) + ' ₽');
        }
        $(document).on('change', '.cybernets input,.cybernets select', function () {
            //console.clear();
            cybernetsCalc();
        });
        cybernetsCalc();
    }
});