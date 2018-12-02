$(document).ready(function () {

    $('.full_height > .row').css('height', window.innerHeight);

    $('#add_employee').on('submit', function (event) {
        event.preventDefault();
        var form = $(this);

        $.ajax( {
            type: "POST",
            url: form.attr( 'action' ),
            data: form.serialize(),
        }).done(function () {
            employees_datatable.ajax.reload();
        });
    });

    $.dobPicker({
        daySelector: '#dobday, #edit_dobday',
        monthSelector: '#dobmonth, #edit_dobmonth',
        yearSelector: '#dobyear, #edit_dobyear',
        dayDefault: 'Day',
        monthDefault: 'Month',
        yearDefault: 'Year'
    });

    $(document).on('click', '#edit_employee_action', function (event){
        event.preventDefault();
        var employee_id = $(this).data('id');
        var employee;

        $.ajax({
            url:'/employee/getdata/' + employee_id
        }).done(function (response) {
            employee = JSON.parse(response);
            console.log(employee);

            $("#edit_employee").attr('action', '/employee/' + employee.id);

            var birth_date = employee.date_of_birth.split(',')[0];
            var birth_year = parseInt(birth_date.split('-')[0], 10);
            var birth_month = parseInt(birth_date.split('-')[1], 10);
            var birth_day = parseInt(birth_date.split('-')[2], 10);

            $("#edit_inputName").val( employee.name );
            $("#edit_inputSurname").val( employee.surname );
            $("#edit_dobmonth").val( birth_month );
            $("#edit_dobday").val( birth_day );
            $("#edit_dobyear").val( birth_year );
            $("input[value="+ employee.gender +"]").prop("checked", true);
            $("#edit_inputPosition").val( employee.position );
            $("#edit_inputSalary").val( employee.salary );
            $("#edit_employee_form").modal('show');
        });
    });


    $("#edit_employee").on('submit', function (event) {
        event.preventDefault();
        var form = $(this);

        $.ajax( {
            type: form.attr( 'method' ),
            url: form.attr( 'action' ),
            data: form.serialize(),
        }).done(function () {
            $("#edit_employee_form").modal('hide');
            employees_datatable.ajax.reload();
        });
    });


    $(document).on('click', '#delete_employee_action', function (event){
        event.preventDefault();
        var employee_id = $(this).data('id');
        console.log(employee_id);
        if(confirm('Are you sure?'))
            $.ajax({
                url:'/employee/' + employee_id,
                type: 'delete',
                data:{
                    _token: _token
                }
            }).done(function () {
                employees_datatable.ajax.reload();
            });
    });

    $("#dump-uploader input").on('change', function () {
        if( $(this).val() ){
            var file_data = $(this).prop('files')[0];
            var form_data = new FormData();
            form_data.append('file', file_data);
            form_data.append('_token', _token);
            $.ajax({
                url: '/employee/upload',
                dataType: 'text',
                cache: false,
                contentType: false,
                processData: false,
                data: form_data,
                type: 'post'
            }).done(function () {
                employees_datatable.ajax.reload();
            });
        }
    });

    $('.dataTables_wrapper #datatable_table_filter input').on('focus', function () {
        $('.dataTables_filter label').addClass('hide_search_icon');
    });

    $('.dataTables_wrapper #datatable_table_filter input').on('blur', function () {
        $('.dataTables_filter label').removeClass('hide_search_icon');
    });
});
