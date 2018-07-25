$(document).ready(function(){
    
    $('#favorite').on('submit', function(e){
        e.preventDefault();
        
        var id = $('#id').val();
        var deptName = $('#dept_Name').val();
    
        $.ajax({
            url: '/home',
            type: 'POST',
            data: {
                id: id,
                deptName: deptName
            },
        
                success: function(){
                console.log(deptName);
            }
        })
    })
});