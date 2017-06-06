$(document).ready(function()
{
    //classes
    function origin() 
    {
        this.shift_x = 0;
        this.shift_y = 0;
    }
    function node() 
    {
        this.west = 0;
        this.north = 0;
        this.east = 0;
        this.south = 0;
        this.value = 0;
        this.path = 0;
        this.closest_origin = 0;
    }


    //main flow of the program
    var nodes = new Array();
    const height = 3; 
    const length = 3; 
    const extended_length = length*3;
    const extended_height = height*3;

    hubs_waiting_to_be_selected = 0;

    for (var k = 0; k < extended_length*extended_height; k++)
    {
        nodes.push(new node());
    }


    function display_table()
    {
        for(var y = 0; y < height; y++)
        {
            for(var x = 0; x < length; x++)
            {
                var offset_in_destination_table = height*(3*length)+length;
                $( "#" + (y*length+x)).html
                ( 
                    " short: " + nodes[offset_in_destination_table + y*length+x].path + 
                    " origin: " + nodes[i].closest_origin
                );
            }
        }
    }


    $("#onSimulate").on( "click", function( event )
    {
        event.preventDefault();
        console.log("Running the simulation!");

        hubs_waiting_to_be_selected = 2;

        $("#alert_selectcells").toggleClass("hidden");

        $('td').css( 'cursor', 'pointer' );
        $('td').hover
        (
            function()
            {
                $(this).toggleClass('selecting-hub');
            }
        );
    });


    function testing_nodes()
    {
        for(var i = 0; i < extended_length*extended_height; i++)
        {
            nodes[i].value = i;
            
        }

        for(var y = 0; y < extended_height; y++)
        {
            for(var x = 0; x < extended_length; x++)
            {
                $("#" + (y*extended_length + x)).html
                ( 
                    "value: " + nodes[y*extended_length + x].value
                );
            }
        }


        //displaying the inner table
        for(var y = 0; y < height; y++)
        {
            for(var x = 0; x < length; x++)
            {
                var offset_x = length;
                var offset_y = height*extended_length;
                // $( "#" + (y*length+x)).html
                // ( 
                //     " short: " + nodes[offset_in_destination_table + y*length+x].path + 
                //     " origin: " + nodes[i].closest_origin
                // );
                $( "#" +  (offset_y+y*extended_length + offset_x + x)).css("background-color", "red");
            }
        }

    }


    function send_packet(from_cell, to_cell)
    {

    }


    

    $( "td" ).on( "click", function( event )
    {
        if(hubs_waiting_to_be_selected > 0)
        {
            var id = $(this).attr('id');
            if(id != "30" && id != "31" && id != "32" && id != "39" && id != "40" &&
                id != "41" && id != "48" && id != "49" && id != "50")
            {
                return;
            }

            $("#" + id).addClass('selected-hub');

            switch(hubs_waiting_to_be_selected)
            {
                case 2: 
                    console.log("sender is selected " + id); 
                    $("#alert_selectcells").html('Please select 1 cells'); 
                    break;
                case 1: 
                    console.log("receiver is selected " + id); 
                    break;
                default:
            }   

            hubs_waiting_to_be_selected--;
            console.log("selected a cell");

            //when all the hubs are already selected
            if(!hubs_waiting_to_be_selected)
            {
                console.log("all cells were selected");
                $('td').css( 'cursor', 'auto' );
                $('td').off('hover');
                $("td").unbind('mouseenter mouseleave');
                $("#alert_selectcells").toggleClass("hidden");
                $("#alert_cellsselected").toggleClass("hidden");
                $("#alert_cellsselected").fadeOut(5000);
            }
        }
    });


    // function display_nodes(nodes)
    // {
    //     const color_divisor = -255/99;
    //     $( "#0" ).addClass('selecting-hub');
    //     for(var i = 0; i < height*length; i++)
    //     {
    //         $( "#" + i ).html( "w: " +  nodes[i].west + " n: " + nodes[i].north + " e: " +  nodes[i].east + " s: " + nodes[i].south );

    //         var sum_of_loads = nodes[i].west + nodes[i].north + nodes[i].east + nodes[i].south;
    //         $( "#" + i ).css("background-color", "rgb(255," + Math.floor(color_divisor*sum_of_loads + 255) + ",0)");

    //     }
    // }

});
