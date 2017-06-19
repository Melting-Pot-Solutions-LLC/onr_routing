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

    function coordinates()
    {
        this.x = null;
        this.y = null;
    }

    function coordinates(x, y)
    {
        this.x = x;
        this.y = y;
    }

    function images()
    {
        this.top = new coordinates();
        this.bottom = new coordinates();
        this.left = new coordinates();
        this.right = new coordinates();
    }

    var sender_images = new images();


    // main flow of the program
    var nodes = new Array();
    const height = 4; 
    const length = 4; 
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
            if(id != "52" && id != "53" && id != "54" && id != "55" && id != "64" &&
                id != "65" && id != "66" && id != "67" && id != "76" && id != "77" && id != "78" && id != "79" && id != "88" && id != "89" && id != "90" && id != "91")
            {
                return;
            }

            $("#" + id).addClass('selected-hub');
            

            switch(hubs_waiting_to_be_selected)
            {
                case 2: 
                    // console.log("sender is selected " + id); 
                    $("#alert_selectcells").html('Please select 1 cells'); 
                    $("#" + id).html('from');
                    sender_images = find_images(id);
                    break;
                case 1: 
                    // console.log("receiver is selected " + id); 
                    $("#" + id).html('to');
                    find_distance(sender_images, id);
                    break;
                default:
            }

            hubs_waiting_to_be_selected--;
            // console.log("selected a cell");

            //when all the hubs are already selected
            if(!hubs_waiting_to_be_selected)
            {
                // console.log("all cells were selected");
                display_nodes();
                $('td').css( 'cursor', 'auto' );
                $('td').off('hover');
                $("td").unbind('mouseenter mouseleave');
                $("#alert_selectcells").toggleClass("hidden");
                $("#alert_cellsselected").toggleClass("hidden");
                $("#alert_cellsselected").fadeOut(5000);
            }
        }
    });

    function find_images(id)
    {
        var c = id_to_coordinates(id);
        var image = new images();

        image.top.y = c.y - height;
        image.top.x = c.x;

        image.bottom.y = c.y + height;
        image.bottom.x = c.x;

        image.left.x = c.x - length;
        image.left.y = c.y;

        image.right.x = c.x + length;
        image.right.y = c.y;


        // console.log(image);
        return image;
    }


    function calculate_distance(point1, potint2)
    {
        return  Math.sqrt((point1.x - potint2.x)*(point1.x - potint2.x) + (point1.y - potint2.y)*(point1.y - potint2.y))
    }


    function find_distance(image, id)
    {
        var receiver = new coordinates();
        var sender = new coordinates();
        sender.x = image.top.x;
        sender.y = image.left.y;

        // console.log(sender);

        receiver = id_to_coordinates(id);
        // console.log(receiver);
        // console.log("dX - " + (image.top.x - receiver.x) + " dY - " + (image.top.y - receiver.y));

        var distance_to_sender = calculate_distance(sender, receiver);

        var distance_to_top = calculate_distance(image.top, receiver);

        var distance_to_bot = calculate_distance(image.bottom, receiver);

        var distance_to_left = calculate_distance(image.left, receiver);

        var distance_to_right = calculate_distance(image.right, receiver);

        var closest_cell_name = min4(distance_to_top, distance_to_right, distance_to_bot, distance_to_left, distance_to_sender)

        var closest_cell = new coordinates();
        switch(closest_cell_name)
        {
            case "top":
            closest_cell.x = image.top.x;
            closest_cell.y = image.top.y;
            break; 

            case "right":
            closest_cell.x = image.right.x;
            closest_cell.y = image.right.y;
            break; 

            case "bottom":
            closest_cell.x = image.bottom.x;
            closest_cell.y = image.bottom.y;
            break; 

            case "left":
            closest_cell.x = image.left.x;
            closest_cell.y = image.left.y;
            break; 
            
            case "sender":
            closest_cell.x = sender.x;
            closest_cell.y = sender.y;
            break; 
        }

        // console.log(closest_cell);
        $("#" + coordinates_to_id(closest_cell)).css("background-color", "Aquamarine");

        send_packet(closest_cell, receiver);
        
    }


    function send_packet(sender, receiver) // both coordiantes
    {
        console.log("sending packet from ");
        console.log(sender);
        console.log("to ");
        console.log(receiver);

        var path = Math.abs(receiver.x - sender.x) + Math.abs(receiver.y - sender.y);

        console.log("path = " + path);

        var next_cell = sender;
        while(path != 0)
        {
            $("#" + coordinates_to_id(next_cell)).css("background-color", "Aquamarine");
            var next_cell_name = min4
            (
                calculate_distance(new coordinates(next_cell.x, next_cell.y-1), receiver),
                calculate_distance(new coordinates(next_cell.x+1, next_cell.y), receiver),
                calculate_distance(new coordinates(next_cell.x, next_cell.y+1), receiver),
                calculate_distance(new coordinates(next_cell.x-1, next_cell.y), receiver), 
                10000
            );
            console.log(next_cell_name);
            var real_node = image_to_real_node(next_cell);

            switch(next_cell_name)
            {
                case "top":
                // $("#" + coordinates_to_id(real_node)).html("n: 1");
                nodes[coordinates_to_id(real_node)].north++;
                next_cell = new coordinates(next_cell.x, next_cell.y-1);
                break; 

                case "right":
                // $("#" + coordinates_to_id(real_node)).html("e: 1");
                nodes[coordinates_to_id(real_node)].east++;
                next_cell = new coordinates(next_cell.x+1, next_cell.y);
                break; 

                case "bottom":
                // $("#" + coordinates_to_id(real_node)).html("s: 1");
                nodes[coordinates_to_id(real_node)].south++;
                next_cell = new coordinates(next_cell.x, next_cell.y+1);
                break; 

                case "left":
                // $("#" + coordinates_to_id(real_node)).html("w: 1");
                nodes[coordinates_to_id(real_node)].west++;
                next_cell = new coordinates(next_cell.x-1, next_cell.y);
                break; 
            }
            path--;
        }

    }

    function min4(number1, number2, number3, number4, number5)
    {
        var closest_outof4 = null;
        var closest_distance = null;
        if(number1 < number2)
        {
            if(number1 < number3)
            {
                if(number1 < number4)
                {
                    closest_outof4 = "top";
                    closest_distance = number1;
                }
                else
                {
                    closest_outof4 = "left";
                    closest_distance = number4;
                }
            }
            else
            {
                if(number3 < number4)
                {
                    closest_outof4 = "bottom";
                    closest_distance = number3;
                }
                else
                {
                    closest_outof4 = "left";
                    closest_distance = number4;
                }
            }
        }
        else
        {
            if(number2 < number3)
            {
                if(number2 < number4)
                {
                    closest_outof4 = "right";
                    closest_distance = number2;
                }
                else
                {
                    closest_outof4 = "left";
                    closest_distance = number4;
                }
            }
            else
            {
                if(number3 < number4)
                {
                    closest_outof4 = "bottom";
                    closest_distance = number3;
                }
                else
                {
                    closest_outof4 = "left";
                    closest_distance = number4;
                }
            }
        }

        if(number5 < closest_distance)
        {
            return "sender";
        }
        else
        {
            return closest_outof4;
        }

    }



    function id_to_coordinates(id)
    {
        var c = new coordinates();
        c.y = Math.floor(id/extended_length);
        c.x = id - c.y*extended_length;
        return c;
    }

    function coordinates_to_id(c)
    {
        return c.y*extended_length + c.x;
    }


    function image_to_real_node(image)
    {
        if((image.x >= length && image.x < length*2) && (image.y >= height && image.y < height*2)) // image is an actual node
        {
            return image;
        }
        else // image is an image
        {
            if(image.x < length && (image.y >= height && image.y < height*2))
                return new coordinates(image.x+length, image.y);
            else if(image.x >= length*2 && (image.y >= height && image.y < height*2))
                return new coordinates(image.x-length, image.y);
            else if((image.x >= length && image.x < length*2) && image.y < height)
                return new coordinates(image.x, image.y+height);
            else if((image.x >= length && image.x < length*2) && image.y >= height)
                return new coordinates(image.x, image.y-height);
            else
            {
                console.log("ERROR: can not find a node corresponding to an image " + image);
                return null;
            }
            
        }

    }

    function display_nodes()
    {
        for (var i = 0; i < extended_length*extended_height; i++)
        {
            $("#" + i).html("w:" + nodes[i].west + " n:" + nodes[i].north + " e:" + nodes[i].east + " s:" + nodes[i].south);
        }   
    }

});
