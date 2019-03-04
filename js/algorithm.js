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
    function isDead()
    {
        this.isDead = false;
    }


    //main flow of the program
    var nodes_original = new Array();
    var nodes_dead = new Array();
    var nodes1 = new Array();

    nodes_original_partial = new Array();
    nodes1_partial = new Array();
    nodes1_partial_shifted = new Array();

    nodes_final = new Array();

    const height = 10; 
    const length = 10; 
    var hubs_waiting_to_be_selected = 0;
    var origin1 = new origin();
    for (var k = 0; k < height*length; k++)
    {
        nodes_original.push(new node());
        nodes1.push(new node());
        nodes_original_partial.push(new node());
        nodes1_partial.push(new node());
        nodes1_partial_shifted.push(new node());
        nodes_final.push(new node());
        nodes_dead.push(new isDead());
    }

    calculate_nodes_original();
    


    // display_nodes(nodes_original);

    $("#inlineFormCustomSelect").on
    (
        'change', function()
        {
            //deselect current cells
            $("td").removeClass('selecting-hub');
            hubs_waiting_to_be_selected = this.value;
            $('td').css( 'cursor', 'pointer' );
            // $("td").mouseover(function(){
            $('td').hover
            (
                function()
                {
                    if(hubs_waiting_to_be_selected > 0)
                    $(this).toggleClass('selecting-hub');
                }
            );


        }
    );

    $( "td" ).on( "click", function( event )
    {
        if(hubs_waiting_to_be_selected > 0)
        {
            var id = $(this).attr('id');
            $("#" + id).addClass('selecting-hub');
            origin1.shift_y = Math.floor(id/length);
            origin1.shift_x = id - Math.floor(id/length)*length;
            console.log(origin1);

            hubs_waiting_to_be_selected--;


            //when all the hubs are already selected
            if(!hubs_waiting_to_be_selected)
            {
                $('td').css( 'cursor', 'auto' );
                populate_nodes1();
                // display_paths();
                calculate_nodes_partials();
                populate_nodes1_partial_shifted();
                sumup_nodes();
                display_nodes(nodes_final);
            }
        }
    });



    function sumup_nodes()
    {
        for(j = 0; j < height; j++)
        {
            for(i = 0; i < length; i++)
            {

                // var closest_origin = (nodes1_partial_shifted[j*length+i].path <= nodes_original_partial[j*length+i].path)? 1 : 0;
                // var path = (closest_origin)? nodes1_partial_shifted[j*length+i].path : nodes_original_partial[j*length+i].path;
                nodes_final[j*length+i].west = nodes1_partial_shifted[j*length+i].west + nodes_original_partial[j*length+i].west;
                nodes_final[j*length+i].north = nodes1_partial_shifted[j*length+i].north + nodes_original_partial[j*length+i].north;
                nodes_final[j*length+i].east = nodes1_partial_shifted[j*length+i].east + nodes_original_partial[j*length+i].east;
                nodes_final[j*length+i].south = nodes1_partial_shifted[j*length+i].south + nodes_original_partial[j*length+i].south;
                nodes_final[j*length+i].path = nodes1_partial_shifted[j*length+i].path;
                nodes_final[j*length+i].closest_origin = nodes1_partial_shifted[j*length+i].closest_origin;

            }
        }
    }

    function populate_nodes1_partial_shifted()
    {
        for(j = 0; j < height; j++)
        {
            for(i = 0; i < length; i++)
            {
                // nodes_original[j*length+i].closest_origin = 0;
                var new_i = i - origin1.shift_x;
                var new_j = j - origin1.shift_y;
                if (new_i < 0) new_i = length + new_i;
                if (new_j < 0) new_j = height + new_j;
                nodes1_partial_shifted[j*length+i].west = nodes1_partial[new_j*length+new_i].west;
                nodes1_partial_shifted[j*length+i].north = nodes1_partial[new_j*length+new_i].north;
                nodes1_partial_shifted[j*length+i].east = nodes1_partial[new_j*length+new_i].east;
                nodes1_partial_shifted[j*length+i].south = nodes1_partial[new_j*length+new_i].south;
                nodes1_partial_shifted[j*length+i].path = nodes1_partial[new_j*length+new_i].path;
                nodes1_partial_shifted[j*length+i].closest_origin = nodes1_partial[new_j*length+new_i].closest_origin;
            }
        }
    }

    
    function populate_secondtable()
    {
        var shift_x = 2;
        var shift_y = 2;

        for (shift_y = 0; shift_y < height; shift_y++)
        {
            for (shift_x = 0; shift_x < length; shift_x++)
            {

                for(j = 0; j < height; j++)
                {
                    for(i = 0; i < length; i++)
                    {
                        // nodes_original[j*length+i].closest_origin = 0;
                        var new_i = i - shift_x;
                        var new_j = j - shift_y;
                        if (new_i < 0) new_i = length + new_i;
                        if (new_j < 0) new_j = height + new_j;
                        nodes1[j*length+i].west += nodes_original[new_j*length+new_i].west;
                        nodes1[j*length+i].north += nodes_original[new_j*length+new_i].north;
                        nodes1[j*length+i].east += nodes_original[new_j*length+new_i].east;
                        nodes1[j*length+i].south += nodes_original[new_j*length+new_i].south;
                        // nodes1[j*length+i].path = nodes_original[new_j*length+new_i].path;        
                    }
                }
            }
        }

    }

    function populate_nodes1()
    {
        for(j = 0; j < height; j++)
        {
            for(i = 0; i < length; i++)
            {
                // nodes_original[j*length+i].closest_origin = 0;
                var new_i = i - origin1.shift_x;
                var new_j = j - origin1.shift_y;
                if (new_i < 0) new_i = length + new_i;
                if (new_j < 0) new_j = height + new_j;
                nodes1[j*length+i].west = nodes_original[new_j*length+new_i].west;
                nodes1[j*length+i].north = nodes_original[new_j*length+new_i].north;
                nodes1[j*length+i].east = nodes_original[new_j*length+new_i].east;
                nodes1[j*length+i].south = nodes_original[new_j*length+new_i].south;
                nodes1[j*length+i].path = nodes_original[new_j*length+new_i].path;        
            }
        }

        for(j = 0; j < height; j++)
        {
            for(i = 0; i < length; i++)
            {
                var shortest_path = (nodes1[j*length+i].path <= nodes_original[j*length+i].path)? nodes1[j*length+i].path : nodes_original[j*length+i].path;
                var closest_origin = (nodes1[j*length+i].path <= nodes_original[j*length+i].path)? 1 : 0;

                nodes_original[j*length+i].closest_origin = closest_origin;
                // nodes_original_partial[j*length+i].closest_origin = closest_origin;
                nodes1[j*length+i].closest_origin = closest_origin;
                // nodes1_partial[j*length+i].closest_origin = closest_origin; 

                nodes_original[j*length+i].path = shortest_path;
                // nodes_original_partial[j*length+i].path = shortest_path;
                nodes1[j*length+i].path = shortest_path;
                // nodes1_partial[j*length+i].path = shortest_path;
            }
        }
    }













    function display_nodes(nodes)
    {
        const color_divisor = -255/99;
        $( "#0" ).addClass('selecting-hub');
        for(var i = 0; i < height*length; i++)
        {
            // $( "#" + i ).html( "w: " +  nodes[i].west + " n: " + nodes[i].north + " e: " +  nodes[i].east + " s: " + nodes[i].south + " path: " + nodes[i].path + " origin: " + nodes[i].closest_origin);
            $( "#" + i ).html( "w: " +  nodes[i].west + " n: " + nodes[i].north + " e: " +  nodes[i].east + " s: " + nodes[i].south );

            var sum_of_loads = nodes[i].west + nodes[i].north + nodes[i].east + nodes[i].south;
            $( "#" + i ).css("background-color", "rgb(255," + Math.floor(color_divisor*sum_of_loads + 255) + ",0)");

        }
    }

    function display_paths()
    {
        for(var i = 0; i < height*length; i++)
        {
            // var shortest_path = (nodes1[i].path <= nodes_original[i].path)? nodes1[i].path : nodes_original[i].path;
            // var closest_origin = (nodes1[i].path <= nodes_original[i].path)? 1 : 0;
            $( "#" + i ).html( 
                //"path0: " +  nodes_original[i].path + " path1: " + nodes1[i].path + 
                " short: " + nodes_original[i].path + 
                " origin: " + nodes_original[i].closest_origin);

            // nodes_original[i].closest_origin = closest_origin;
            // nodes1[i].closest_origin = closest_origin;

        }
    }

    function calculate_nodes_partials()
    {
        var i = x = y = count = path = j = 0;
        var af = xf = yf = 0.0;

        for (j=0; j<height; j++)
        {
            for (i=0; i<length; i++)
            {
                if(nodes_original[i*length+j].closest_origin == 0)
                {
                    
                    //1st quarter
                    if ((j<=(length%2==0 ? Math.floor(length/2) : Math.floor(length/2))) && (i<=(height%2==0 ? Math.floor(height/2-1) : Math.floor(height/2-1))))
                    {
                        nodes_original_partial[y*length+x].value = i*length + j;
                        x = j;
                        y = i;
                        af = (y)/(x);
                        path = y + x;
                        nodes_original_partial[y*length+x].path = path;

                        
                            while (path>0)
                            {
                                yf = af*(x);
                                xf = (y)/af;
                                if (((j>=i)&(y-yf<0.5))||((i>j)&(x-xf>0.5)))
                                {

                                    nodes_original_partial[y*length+x].west++;
                                    nodes_original_partial[y*length+x-1].east++;
                                    x--;
                                }
                                else
                                {

                                    nodes_original_partial[y*length+x].north++;
                                    nodes_original_partial[(y-1)*length+x].south++;
                                    y--;
                                }
                                path--;
                            }
                        
                    }
                    //2nd quarter
                    if ((j>=(length%2==0 ? Math.floor(length/2+1) : Math.floor(length/2+1))) && (i<=(height%2==0 ? Math.floor(height/2-1) : Math.floor(height/2))))
                    {

                        x = j;
                        y = i;
                        af = (y)/(length-x);
                        path = y+length-x;
                        nodes_original_partial[y*length+x].path = path;


                        
                            while (path>0)
                            {
                                yf = af*(length-x);
                                xf = length-(y)/af;
                                if (((i>=length-j)&(y-yf<0.5))||((i<length-j)&(y-yf<-0.5)))
                                {
                                    if (x==length-1)
                                    {

                                        nodes_original_partial[y*length+x].east++;
                                        x=0;
                                        nodes_original_partial[y*length+x].west++;
                                    }
                                    else if (x==0)
                                    {

                                        nodes_original_partial[y*length+x].north++;
                                        nodes_original_partial[(y-1)*length+x].south++;
                                        y--;
                                    }
                                    else
                                    {

                                        nodes_original_partial[y*length+x].east++;
                                        nodes_original_partial[y*length+x+1].west++;
                                        x++;
                                    }
                                }
                                else
                                {
                                    if(y==0)
                                    {
                                        if (x==length-1)
                                        {

                                            nodes_original_partial[y*length+x].east++;
                                            x=0;
                                            nodes_original_partial[y*length+x].west++;
                                        }
                                        else
                                        {

                                            nodes_original_partial[y*length+x].east++;
                                            nodes_original_partial[y*length+x+1].west++;
                                            x++;
                                        }
                                    }
                                    else
                                    {

                                        nodes_original_partial[y*length+x].north++;
                                        nodes_original_partial[(y-1)*length+x].south++;
                                        y--;
                                    }
                                }
                                path--;
                            }
                        
                    }
                    //3rd quarter
                    if ((j>=(length%2==0 ? Math.floor(length/2) : Math.floor(length/2+1))) && (i>=(height%2==0 ? Math.floor(height/2) : Math.floor(height/2+1))))
                    {
                        x = j;
                        y = i;
                        af = (y)/(x);
                        path = height-y+length-x;
                        nodes_original_partial[y*length+x].path = path;


                        
                            while (path>0)
                            {
                                yf = af*(x);
                                xf = (y)/af;
                                if(((i>j)&(yf-y<0.5))||((i<=j)&(yf-y<-0.5)))
                                {
                                //if ((yf-y<0.5)) {
                                    if (x==length-1)
                                    {

                                        nodes_original_partial[y*length+x].east++;
                                        x=0;
                                        nodes_original_partial[y*length+x].west++;
                                    }
                                    else if (x==0)
                                    {
                                        if (y==height-1)
                                        {

                                            nodes_original_partial[y*length+x].south++;
                                            y=0;
                                            nodes_original_partial[y*length+x].north++;
                                        }
                                        else
                                        {

                                            nodes_original_partial[y*length+x].south++;
                                            nodes_original_partial[(y+1)*length+x].north++;
                                            y++;
                                        }
                                    }
                                    else
                                    {

                                        nodes_original_partial[y*length+x].east++;
                                        nodes_original_partial[y*length+x+1].west++;
                                        x++;
                                    }
                                }
                                else if (y==height-1)
                                {

                                    nodes_original_partial[y*length+x].south++;
                                    y=0;
                                    nodes_original_partial[y*length+x].north++;
                                }
                                else if (y==0)
                                {
                                    if ((x==length-1))
                                    {

                                        nodes_original_partial[y*length+x].east++;
                                        x=0;
                                        nodes_original_partial[y*length+x].west++;
                                    }
                                    else
                                    {

                                        nodes_original_partial[y*length+x].east++;
                                        nodes_original_partial[y*length+x+1].west++;
                                        x++;
                                    }
                                }

                                else
                                {

                                    nodes_original_partial[y*length+x].south++;
                                    nodes_original_partial[(y+1)*length+x].north++;
                                    y++;
                                }
                                path--;
                            }
                        
                    }
                    //4th quarter
                    if ((j<=(length%2==0 ? Math.floor(length/2-1) : Math.floor(length/2))) && (i>=(height%2==0 ? Math.floor(height/2) : Math.floor(height/2))))
                    {
                        x = j;
                        y = i;
                        af = (height-y)/(x);
                        path = height-y+x;
                        nodes_original_partial[y*length+x].path = path;

                        
                            while (path>0)
                            {
                                yf = height-af*(x);
                                xf = (height-y)/af;
                                if (((height-i<j)&(yf-y<0.5))||((height-i>=j)&(yf-y<-0.5)))
                                {
                                    if (x==0)
                                    {
                                        if (y==height-1)
                                        {
                                            //table[nodes[y*length+x].value][nodes[i*length+j].value] = 4;
                                            nodes_original_partial[y*length+x].south++;
                                            y=0;
                                            nodes_original_partial[y*length+x].north++;
                                        }
                                        else
                                        {
                                            //table[nodes[y*length+x].value][nodes[i*length+j].value] = 4;
                                            nodes_original_partial[y*length+x].south++;
                                            nodes_original_partial[(y+1)*length+x].north++;
                                            y++;
                                        }
                                    }
                                    else
                                    {
                                        //table[nodes[y*length+x].value][nodes[i*length+j].value] = 1;
                                        nodes_original_partial[y*length+x].west++;
                                        nodes_original_partial[y*length+x-1].east++;
                                        x--;
                                    }
                                }
                                else
                                {
                                    if (y==height-1)
                                    {
                                        //table[nodes[y*length+x].value][nodes[i*length+j].value] = 4;
                                        nodes_original_partial[y*length+x].south++;
                                        y=0;
                                        nodes_original_partial[y*length+x].north++;
                                    }
                                    else if (y==0)
                                    {
                                        //table[nodes[y*length+x].value][nodes[i*length+j].value] = 1;
                                        nodes_original_partial[y*length+x].west++;
                                        nodes_original_partial[y*length+x-1].east++;
                                        x--;
                                    }
                                    else
                                    {
                                        //table[nodes[y*length+x].value][nodes[i*length+j].value] = 4;
                                        nodes_original_partial[y*length+x].south++;
                                        nodes_original_partial[(y+1)*length+x].north++;
                                        y++;
                                    }
                                }
                                path--;
                            }
                        
                    }
                }
                else // if closest origin is 1
                {
                    var new_i = i - origin1.shift_x;
                    var new_j = j - origin1.shift_y;
                    if (new_i < 0) new_i = length + new_i;
                    if (new_j < 0) new_j = height + new_j;
                    var old_i = i;
                    var old_j = j;
                    i = new_i;
                    j = new_j;

                    nodes1_partial[i*length+j].closest_origin = 1;
                    //1st quarter
                    if ((j<=(length%2==0 ? Math.floor(length/2) : Math.floor(length/2))) && (i<=(height%2==0 ? Math.floor(height/2-1) : Math.floor(height/2-1))))
                    {
                        nodes1_partial[y*length+x].value = i*length + j;
                        x = j;
                        y = i;
                        af = (y)/(x);
                        path = y + x;



                        nodes1_partial[y*length+x].path = path;

                        
                            while (path>0)
                            {
                                yf = af*(x);
                                xf = (y)/af;
                                if (((j>=i)&(y-yf<0.5))||((i>j)&(x-xf>0.5)))
                                {

                                    nodes1_partial[y*length+x].west++;
                                    nodes1_partial[y*length+x-1].east++;
                                    x--;
                                }
                                else
                                {

                                    nodes1_partial[y*length+x].north++;
                                    nodes1_partial[(y-1)*length+x].south++;
                                    y--;
                                }
                                path--;
                            }
                        
                    }
                    //2nd quarter
                    if ((j>=(length%2==0 ? Math.floor(length/2+1) : Math.floor(length/2+1))) && (i<=(height%2==0 ? Math.floor(height/2-1) : Math.floor(height/2))))
                    {

                        x = j;
                        y = i;
                        af = (y)/(length-x);
                        path = y+length-x;
                        nodes1_partial[y*length+x].path = path;


                        
                            while (path>0)
                            {
                                yf = af*(length-x);
                                xf = length-(y)/af;
                                if (((i>=length-j)&(y-yf<0.5))||((i<length-j)&(y-yf<-0.5)))
                                {
                                    if (x==length-1)
                                    {

                                        nodes1_partial[y*length+x].east++;
                                        x=0;
                                        nodes1_partial[y*length+x].west++;
                                    }
                                    else if (x==0)
                                    {

                                        nodes1_partial[y*length+x].north++;
                                        nodes1_partial[(y-1)*length+x].south++;
                                        y--;
                                    }
                                    else
                                    {

                                        nodes1_partial[y*length+x].east++;
                                        nodes1_partial[y*length+x+1].west++;
                                        x++;
                                    }
                                }
                                else
                                {
                                    if(y==0)
                                    {
                                        if (x==length-1)
                                        {

                                            nodes1_partial[y*length+x].east++;
                                            x=0;
                                            nodes1_partial[y*length+x].west++;
                                        }
                                        else
                                        {

                                            nodes1_partial[y*length+x].east++;
                                            nodes1_partial[y*length+x+1].west++;
                                            x++;
                                        }
                                    }
                                    else
                                    {

                                        nodes1_partial[y*length+x].north++;
                                        nodes1_partial[(y-1)*length+x].south++;
                                        y--;
                                    }
                                }
                                path--;
                            }
                        
                    }
                    //3rd quarter
                    if ((j>=(length%2==0 ? Math.floor(length/2) : Math.floor(length/2+1))) && (i>=(height%2==0 ? Math.floor(height/2) : Math.floor(height/2+1))))
                    {
                        x = j;
                        y = i;
                        af = (y)/(x);
                        path = height-y+length-x;
                        nodes1_partial[y*length+x].path = path;


                        
                            while (path>0)
                            {
                                yf = af*(x);
                                xf = (y)/af;
                                if(((i>j)&(yf-y<0.5))||((i<=j)&(yf-y<-0.5)))
                                {
                                //if ((yf-y<0.5)) {
                                    if (x==length-1)
                                    {

                                        nodes1_partial[y*length+x].east++;
                                        x=0;
                                        nodes1_partial[y*length+x].west++;
                                    }
                                    else if (x==0)
                                    {
                                        if (y==height-1)
                                        {

                                            nodes1_partial[y*length+x].south++;
                                            y=0;
                                            nodes1_partial[y*length+x].north++;
                                        }
                                        else
                                        {

                                            nodes1_partial[y*length+x].south++;
                                            nodes1_partial[(y+1)*length+x].north++;
                                            y++;
                                        }
                                    }
                                    else
                                    {

                                        nodes1_partial[y*length+x].east++;
                                        nodes1_partial[y*length+x+1].west++;
                                        x++;
                                    }
                                }
                                else if (y==height-1)
                                {

                                    nodes1_partial[y*length+x].south++;
                                    y=0;
                                    nodes1_partial[y*length+x].north++;
                                }
                                else if (y==0)
                                {
                                    if ((x==length-1))
                                    {

                                        nodes1_partial[y*length+x].east++;
                                        x=0;
                                        nodes1_partial[y*length+x].west++;
                                    }
                                    else
                                    {

                                        nodes1_partial[y*length+x].east++;
                                        nodes1_partial[y*length+x+1].west++;
                                        x++;
                                    }
                                }

                                else
                                {

                                    nodes1_partial[y*length+x].south++;
                                    nodes1_partial[(y+1)*length+x].north++;
                                    y++;
                                }
                                path--;
                            }
                        
                    }
                    //4th quarter
                    if ((j<=(length%2==0 ? Math.floor(length/2-1) : Math.floor(length/2))) && (i>=(height%2==0 ? Math.floor(height/2) : Math.floor(height/2))))
                    {
                        x = j;
                        y = i;
                        af = (height-y)/(x);
                        path = height-y+x;
                        nodes1_partial[y*length+x].path = path;

                        
                            while (path>0)
                            {
                                yf = height-af*(x);
                                xf = (height-y)/af;
                                if (((height-i<j)&(yf-y<0.5))||((height-i>=j)&(yf-y<-0.5)))
                                {
                                    if (x==0)
                                    {
                                        if (y==height-1)
                                        {
                                            //table[nodes[y*length+x].value][nodes[i*length+j].value] = 4;
                                            nodes1_partial[y*length+x].south++;
                                            y=0;
                                            nodes1_partial[y*length+x].north++;
                                        }
                                        else
                                        {
                                            //table[nodes[y*length+x].value][nodes[i*length+j].value] = 4;
                                            nodes1_partial[y*length+x].south++;
                                            nodes1_partial[(y+1)*length+x].north++;
                                            y++;
                                        }
                                    }
                                    else
                                    {
                                        //table[nodes[y*length+x].value][nodes[i*length+j].value] = 1;
                                        nodes1_partial[y*length+x].west++;
                                        nodes1_partial[y*length+x-1].east++;
                                        x--;
                                    }
                                }
                                else
                                {
                                    if (y==height-1)
                                    {
                                        //table[nodes[y*length+x].value][nodes[i*length+j].value] = 4;
                                        nodes1_partial[y*length+x].south++;
                                        y=0;
                                        nodes1_partial[y*length+x].north++;
                                    }
                                    else if (y==0)
                                    {
                                        //table[nodes[y*length+x].value][nodes[i*length+j].value] = 1;
                                        nodes1_partial[y*length+x].west++;
                                        nodes1_partial[y*length+x-1].east++;
                                        x--;
                                    }
                                    else
                                    {
                                        //table[nodes[y*length+x].value][nodes[i*length+j].value] = 4;
                                        nodes1_partial[y*length+x].south++;
                                        nodes1_partial[(y+1)*length+x].north++;
                                        y++;
                                    }
                                }
                                path--;
                            }
                        
                    }
                    i = old_i;
                    j = old_j;
                }

            }
        }
    }


    /*
    *
    *
    * 
    * 
    *  Ivan's original algorithm
    * 
    * 
    * 
    */
    function calculate_nodes_original()
    {
        var i = x = y = count = path = j = 0;
        var af = xf = yf = 0.0;

        for (j=0; j<height; j++)
        {
            for (i=0; i<length; i++)
            {

                //1st quarter
                if ((j<=(length%2==0 ? Math.floor(length/2) : Math.floor(length/2))) && (i<=(height%2==0 ? Math.floor(height/2-1) : Math.floor(height/2-1))))
                {
                    nodes_original[y*length+x].value = i*length + j;
                    x = j;
                    y = i;
                    af = (y)/(x); // angle tangent 
                    path = y + x;
                    nodes_original[y*length+x].path = path;

                    
                        while (path>0)
                        {
                            yf = af*(x);
                            xf = (y)/af;
                            // console.log("x = ", x)
                            // console.log("y = ", y)
                            // console.log("af = ", af)
                            // console.log("yf = ", yf)
                            // console.log("xf = ", xf)
                            if (((j>=i)&(y-yf<0.5))||((i>j)&(x-xf>0.5)))
                            {
                                // move left
                                nodes_original[y*length+x].west++;
                                nodes_original[y*length+x-1].east++;
                                x--;
                            }
                            else
                            {
                                // move up
                                nodes_original[y*length+x].north++;
                                nodes_original[(y-1)*length+x].south++;
                                y--;
                            }
                            path--;
                        }
                    
                }
                //2nd quarter
                if ((j>=(length%2==0 ? Math.floor(length/2+1) : Math.floor(length/2+1))) && (i<=(height%2==0 ? Math.floor(height/2-1) : Math.floor(height/2))))
                {

                    x = j;
                    y = i;
                    af = (y)/(length-x);
                    path = y+length-x;
                    nodes_original[y*length+x].path = path;


                    
                        while (path>0)
                        {
                            yf = af*(length-x);
                            xf = length-(y)/af;
                            if (((i>=length-j)&(y-yf<0.5))||((i<length-j)&(y-yf<-0.5)))
                            {
                                if (x==length-1)
                                {
                                    // move right
                                    nodes_original[y*length+x].east++;
                                    x=0;
                                    nodes_original[y*length+x].west++;
                                }
                                else if (x==0)
                                {
                                    // move up
                                    nodes_original[y*length+x].north++;
                                    nodes_original[(y-1)*length+x].south++;
                                    y--;
                                }
                                else
                                {
                                    // move right
                                    nodes_original[y*length+x].east++;
                                    nodes_original[y*length+x+1].west++;
                                    x++;
                                }
                            }
                            else
                            {
                                if(y==0)
                                {
                                    if (x==length-1)
                                    {
                                        // move right
                                        nodes_original[y*length+x].east++;
                                        x=0;
                                        nodes_original[y*length+x].west++;
                                    }
                                    else
                                    {
                                        // move right
                                        nodes_original[y*length+x].east++;
                                        nodes_original[y*length+x+1].west++;
                                        x++;
                                    }
                                }
                                else
                                {
                                    // move up
                                    nodes_original[y*length+x].north++;
                                    nodes_original[(y-1)*length+x].south++;
                                    y--;
                                }
                            }
                            path--;
                        }
                    
                }
                //3rd quarter
                if ((j>=(length%2==0 ? Math.floor(length/2) : Math.floor(length/2+1))) && (i>=(height%2==0 ? Math.floor(height/2) : Math.floor(height/2+1))))
                {
                    x = j;
                    y = i;
                    af = (y)/(x);
                    path = height-y+length-x;
                    nodes_original[y*length+x].path = path;


                    
                        while (path>0)
                        {
                            yf = af*(x);
                            xf = (y)/af;
                            if(((i>j)&(yf-y<0.5))||((i<=j)&(yf-y<-0.5)))
                            {
                            //if ((yf-y<0.5)) {
                                if (x==length-1)
                                {
                                    // move right
                                    nodes_original[y*length+x].east++;
                                    x=0;
                                    nodes_original[y*length+x].west++;
                                }
                                else if (x==0)
                                {
                                    if (y==height-1)
                                    {
                                        // move down
                                        nodes_original[y*length+x].south++;
                                        y=0;
                                        nodes_original[y*length+x].north++;
                                    }
                                    else
                                    {
                                        // move down
                                        nodes_original[y*length+x].south++;
                                        nodes_original[(y+1)*length+x].north++;
                                        y++;
                                    }
                                }
                                else
                                {
                                    // move rigth
                                    nodes_original[y*length+x].east++;
                                    nodes_original[y*length+x+1].west++;
                                    x++;
                                }
                            }
                            else if (y==height-1)
                            {
                                // move down
                                nodes_original[y*length+x].south++;
                                y=0;
                                nodes_original[y*length+x].north++;
                            }
                            else if (y==0)
                            {
                                if ((x==length-1))
                                {
                                    // move right
                                    nodes_original[y*length+x].east++;
                                    x=0;
                                    nodes_original[y*length+x].west++;
                                }
                                else
                                {

                                    nodes_original[y*length+x].east++;
                                    nodes_original[y*length+x+1].west++;
                                    x++;
                                }
                            }

                            else
                            {

                                nodes_original[y*length+x].south++;
                                nodes_original[(y+1)*length+x].north++;
                                y++;
                            }
                            path--;
                        }
                    
                }
                //4th quarter
                if ((j<=(length%2==0 ? Math.floor(length/2-1) : Math.floor(length/2))) && (i>=(height%2==0 ? Math.floor(height/2) : Math.floor(height/2))))
                {
                    x = j;
                    y = i;
                    af = (height-y)/(x);
                    path = height-y+x;
                    nodes_original[y*length+x].path = path;

                    
                        while (path>0)
                        {
                            yf = height-af*(x);
                            xf = (height-y)/af;
                            if (((height-i<j)&(yf-y<0.5))||((height-i>=j)&(yf-y<-0.5)))
                            {
                                if (x==0)
                                {
                                    if (y==height-1)
                                    {
                                        //table[nodes[y*length+x].value][nodes[i*length+j].value] = 4;
                                        nodes_original[y*length+x].south++;
                                        y=0;
                                        nodes_original[y*length+x].north++;
                                    }
                                    else
                                    {
                                        //table[nodes[y*length+x].value][nodes[i*length+j].value] = 4;
                                        nodes_original[y*length+x].south++;
                                        nodes_original[(y+1)*length+x].north++;
                                        y++;
                                    }
                                }
                                else
                                {
                                    //table[nodes[y*length+x].value][nodes[i*length+j].value] = 1;
                                    nodes_original[y*length+x].west++;
                                    nodes_original[y*length+x-1].east++;
                                    x--;
                                }
                            }
                            else
                            {
                                if (y==height-1)
                                {
                                    //table[nodes[y*length+x].value][nodes[i*length+j].value] = 4;
                                    nodes_original[y*length+x].south++;
                                    y=0;
                                    nodes_original[y*length+x].north++;
                                }
                                else if (y==0)
                                {
                                    //table[nodes[y*length+x].value][nodes[i*length+j].value] = 1;
                                    nodes_original[y*length+x].west++;
                                    nodes_original[y*length+x-1].east++;
                                    x--;
                                }
                                else
                                {
                                    //table[nodes[y*length+x].value][nodes[i*length+j].value] = 4;
                                    nodes_original[y*length+x].south++;
                                    nodes_original[(y+1)*length+x].north++;
                                    y++;
                                }
                            }
                            path--;
                        }
                    
                }

            }
        }
        console.log("Iva's original algorithm");
        console.log(nodes_original);
    }


    $("#onSimulate").on( "click", function( event )
    {
        event.preventDefault();
        console.log("Running the simulation!");

        populate_secondtable();
        display_nodes(nodes1);

    });








    // var mode = "hubs_not_selected";
    // var hubs_waiting_to_be_selected = 0;
    // var nodes2 = new Array();
    // var origin2 = new origin();

    // const height = 10; 
    // const length = 10; 
    // var nodes = new Array();

    //     for (var k = 0; k < height*length; k++)
    //     {
    //         nodes.push(new node());
    //         nodes2.push(new node());

            
    //     }
    


    // $( "td" ).on( "click", function( event )
    // {
    //     if(hubs_waiting_to_be_selected > 0)
    //     {
    //         // alert("that will be a new hub");
    //         // $( "#1" ).addClass( "selecting-hub" );
    //         var id = $(this).attr('id');
    //         $("#" + id).addClass('selecting-hub');
    //         origin2.shift_y = Math.floor(id/length);
    //         origin2.shift_x = id - Math.floor(id/length)*length;
    //          console.log(origin2);

    //         hubs_waiting_to_be_selected--;


    //         //when all the hubs are already selected
    //         if(!hubs_waiting_to_be_selected)
    //         {
    //             $('td').css( 'cursor', 'auto' );
    //         }
    //     }
    // });


    // function node() 
    // {
    //     this.west = 0;
    //     this.north = 0;
    //     this.east = 0;
    //     this.south = 0;
    //     this.value = 0;
    //     this.path = 0;
    //     this.closest_origin = 0;
    // }

    // function origin() 
    // {
    //     this.shift_x = 0;
    //     this.shift_y = 0;
    // }

    // $("#inlineFormCustomSelect").on
    // (
    //     'change', function()
    //     {
    //         //deselect current cells
    //         $("td").removeClass('selecting-hub');
    //         hubs_waiting_to_be_selected = this.value;
    //         $('td').css( 'cursor', 'pointer' );
    //         // $("td").mouseover(function(){
    //         $('td').hover
    //         (
    //             function()
    //             {
    //                 if(hubs_waiting_to_be_selected > 0)
    //                 $(this).toggleClass('selecting-hub');
    //             }
    //         );


    //     }
    // );

    // $("#onSimulate").on( "click", function( event )
    // {
    //     event.preventDefault();
    //     console.log("Running the simulation!");

    //     //delesect how many hubs
    //     $("#inlineFormCustomSelect").val("0");


    //      var i = x = y = count = path = j = 0;
    //      var af = xf = yf = 0.0;
    //     //  var j = 0;



    //     for (j=0; j<height; j++)
    //     {
    //         for (i=0; i<length; i++)
    //         {
                 
    //             //1st quarter
    //             if ((j<=(length%2==0 ? Math.floor(length/2) : Math.floor(length/2))) && (i<=(height%2==0 ? Math.floor(height/2-1) : Math.floor(height/2-1))))
    //             {
    //                 nodes[y*length+x].value = i*length + j;
    //                 x = j;
    //                 y = i;
    //                 af = (y)/(x);
    //                 path = y + x;
    //                 nodes[y*length+x].path = path;
    //                 // nodes2[y*length+x].path = Math.abs(i - origin2.shift_y) + Math.abs(j - origin2.shift_x); 
    //                 // nodes[y*length+x].closest_origin = (nodes[y*length+x].path <  nodes2[y*length+x].path)? 1 : 2;
                    
    //                     while (path>0)
    //                     {
    //                         yf = af*(x);
    //                         xf = (y)/af;
    //                         if (((j>=i)&(y-yf<0.5))||((i>j)&(x-xf>0.5)))
    //                         {
    //                             //table[nodes[y*length+x].value][nodes[i*length+j].value] = 1;
    //                             nodes[y*length+x].west++;
    //                             nodes[y*length+x-1].east++;
    //                             x--;
    //                         }
    //                         else
    //                         {
    //                             //table[nodes[y*length+x].value][nodes[i*length+j].value] = 2;
    //                             nodes[y*length+x].north++;
    //                             nodes[(y-1)*length+x].south++;
    //                             y--;
    //                         }
    //                         path--;
    //                     }
                    
    //             }
    //             //2nd quarter
    //             if ((j>=(length%2==0 ? Math.floor(length/2+1) : Math.floor(length/2+1))) && (i<=(height%2==0 ? Math.floor(height/2-1) : Math.floor(height/2))))
    //             {

    //                 x = j;
    //                 y = i;
    //                 af = (y)/(length-x);
    //                 path = y+length-x;
    //                 nodes[y*length+x].path = path;
    //                 // nodes2[y*length+x].path = Math.abs(i - origin2.shift_y) + Math.abs(length - j - origin2.shift_x); 
    //                 // nodes[y*length+x].closest_origin = (nodes[y*length+x].path <  nodes2[y*length+x].path)? 1 : 2;

                    
    //                     while (path>0)
    //                     {
    //                         yf = af*(length-x);
    //                         xf = length-(y)/af;
    //                         if (((i>=length-j)&(y-yf<0.5))||((i<length-j)&(y-yf<-0.5)))
    //                         {
    //                             if (x==length-1)
    //                             {
    //                                 //table[nodes[y*length+x].value][nodes[i*length+j].value] = 3;
    //                                 nodes[y*length+x].east++;
    //                                 x=0;
    //                                 nodes[y*length+x].west++;
    //                             }
    //                             else if (x==0)
    //                             {
    //                                 //table[nodes[y*length+x].value][nodes[i*length+j].value] = 2;
    //                                 nodes[y*length+x].north++;
    //                                 nodes[(y-1)*length+x].south++;
    //                                 y--;
    //                             }
    //                             else
    //                             {
    //                                 //table[nodes[y*length+x].value][nodes[i*length+j].value] = 3;
    //                                 nodes[y*length+x].east++;
    //                                 nodes[y*length+x+1].west++;
    //                                 x++;
    //                             }
    //                         }
    //                         else
    //                         {
    //                             if(y==0)
    //                             {
    //                                 if (x==length-1)
    //                                 {
    //                                     //table[nodes[y*length+x].value][nodes[i*length+j].value] = 3;
    //                                     nodes[y*length+x].east++;
    //                                     x=0;
    //                                     nodes[y*length+x].west++;
    //                                 }
    //                                 else
    //                                 {
    //                                     //table[nodes[y*length+x].value][nodes[i*length+j].value] = 3;
    //                                     nodes[y*length+x].east++;
    //                                     nodes[y*length+x+1].west++;
    //                                     x++;
    //                                 }
    //                             }
    //                             else
    //                             {
    //                                 //table[nodes[y*length+x].value][nodes[i*length+j].value] = 2;
    //                                 nodes[y*length+x].north++;
    //                                 nodes[(y-1)*length+x].south++;
    //                                 y--;
    //                             }
    //                         }
    //                         path--;
    //                     }
                    
    //             }
    //             //3rd quarter
    //             if ((j>=(length%2==0 ? Math.floor(length/2) : Math.floor(length/2+1))) && (i>=(height%2==0 ? Math.floor(height/2) : Math.floor(height/2+1))))
    //             {
    //                 x = j;
    //                 y = i;
    //                 af = (y)/(x);
    //                 path = height-y+length-x;
    //                 nodes[y*length+x].path = path;
    //                 // nodes2[y*length+x].path = Math.abs(height - i - origin2.shift_y) + Math.abs(length -j - origin2.shift_x); 
    //                 // nodes[y*length+x].closest_origin = (nodes[y*length+x].path <  nodes2[y*length+x].path)? 1 : 2;

                    
    //                     while (path>0)
    //                     {
    //                         yf = af*(x);
    //                         xf = (y)/af;
    //                         if(((i>j)&(yf-y<0.5))||((i<=j)&(yf-y<-0.5)))
    //                         {
    //                         //if ((yf-y<0.5)) {
    //                             if (x==length-1)
    //                             {
    //                                 //table[nodes[y*length+x].value][nodes[i*length+j].value] = 3;
    //                                 nodes[y*length+x].east++;
    //                                 x=0;
    //                                 nodes[y*length+x].west++;
    //                             }
    //                             else if (x==0)
    //                             {
    //                                 if (y==height-1)
    //                                 {
    //                                     //table[nodes[y*length+x].value][nodes[i*length+j].value] = 4;
    //                                     nodes[y*length+x].south++;
    //                                     y=0;
    //                                     nodes[y*length+x].north++;
    //                                 }
    //                                 else
    //                                 {
    //                                     //table[nodes[y*length+x].value][nodes[i*length+j].value] = 4;
    //                                     nodes[y*length+x].south++;
    //                                     nodes[(y+1)*length+x].north++;
    //                                     y++;
    //                                 }
    //                             }
    //                             else
    //                             {
    //                                 //table[nodes[y*length+x].value][nodes[i*length+j].value] = 3;
    //                                 nodes[y*length+x].east++;
    //                                 nodes[y*length+x+1].west++;
    //                                 x++;
    //                             }
    //                         }
    //                         else if (y==height-1)
    //                         {
    //                             //table[nodes[y*length+x].value][nodes[i*length+j].value] = 4;
    //                             nodes[y*length+x].south++;
    //                             y=0;
    //                             nodes[y*length+x].north++;
    //                         }
    //                         else if (y==0)
    //                         {
    //                             if ((x==length-1))
    //                             {
    //                                 //table[nodes[y*length+x].value][nodes[i*length+j].value] = 3;
    //                                 nodes[y*length+x].east++;
    //                                 x=0;
    //                                 nodes[y*length+x].west++;
    //                             }
    //                             else
    //                             {
    //                                 //table[nodes[y*length+x].value][nodes[i*length+j].value] = 3;
    //                                 nodes[y*length+x].east++;
    //                                 nodes[y*length+x+1].west++;
    //                                 x++;
    //                             }
    //                         }

    //                         else
    //                         {
    //                             //table[nodes[y*length+x].value][nodes[i*length+j].value] = 4;
    //                             nodes[y*length+x].south++;
    //                             nodes[(y+1)*length+x].north++;
    //                             y++;
    //                         }
    //                         path--;
    //                     }
                    
    //             }
    //             //4th quarter
    //             if ((j<=(length%2==0 ? Math.floor(length/2-1) : Math.floor(length/2))) && (i>=(height%2==0 ? Math.floor(height/2) : Math.floor(height/2))))
    //             {
    //                 x = j;
    //                 y = i;
    //                 af = (height-y)/(x);
    //                 path = height-y+x;
    //                 nodes[y*length+x].path = path;
    //                 // nodes2[y*length+x].path = Math.abs(height - i - origin2.shift_y) + Math.abs(j - origin2.shift_x); 
    //                 // nodes[y*length+x].closest_origin = (nodes[y*length+x].path <  nodes2[y*length+x].path)? 1 : 2;

                    
    //                     while (path>0)
    //                     {
    //                         yf = height-af*(x);
    //                         xf = (height-y)/af;
    //                         if (((height-i<j)&(yf-y<0.5))||((height-i>=j)&(yf-y<-0.5)))
    //                         {
    //                             if (x==0)
    //                             {
    //                                 if (y==height-1)
    //                                 {
    //                                     //table[nodes[y*length+x].value][nodes[i*length+j].value] = 4;
    //                                     nodes[y*length+x].south++;
    //                                     y=0;
    //                                     nodes[y*length+x].north++;
    //                                 }
    //                                 else
    //                                 {
    //                                     //table[nodes[y*length+x].value][nodes[i*length+j].value] = 4;
    //                                     nodes[y*length+x].south++;
    //                                     nodes[(y+1)*length+x].north++;
    //                                     y++;
    //                                 }
    //                             }
    //                             else
    //                             {
    //                                 //table[nodes[y*length+x].value][nodes[i*length+j].value] = 1;
    //                                 nodes[y*length+x].west++;
    //                                 nodes[y*length+x-1].east++;
    //                                 x--;
    //                             }
    //                         }
    //                         else
    //                         {
    //                             if (y==height-1)
    //                             {
    //                                 //table[nodes[y*length+x].value][nodes[i*length+j].value] = 4;
    //                                 nodes[y*length+x].south++;
    //                                 y=0;
    //                                 nodes[y*length+x].north++;
    //                             }
    //                             else if (y==0)
    //                             {
    //                                 //table[nodes[y*length+x].value][nodes[i*length+j].value] = 1;
    //                                 nodes[y*length+x].west++;
    //                                 nodes[y*length+x-1].east++;
    //                                 x--;
    //                             }
    //                             else
    //                             {
    //                                 //table[nodes[y*length+x].value][nodes[i*length+j].value] = 4;
    //                                 nodes[y*length+x].south++;
    //                                 nodes[(y+1)*length+x].north++;
    //                                 y++;
    //                             }
    //                         }
    //                         path--;
    //                     }
                    
    //             }
    //             // compute the closes origin for the current cell
    //             // nodes[y*length+x].closest_origin = (nodes[y*length+x].path <  nodes2[y*length+x].path)? 1 : 2;
    //             // nodes2[y*length+x].closest_origin = (nodes[y*length+x].path <  nodes2[y*length+x].path)? 1 : 2;
    //         }
    //     }


    //     // console.log(origin2);

    //     for(j = 0; j < height; j++)
    //     {
    //         for(i = 0; i < length; i++)
    //         {
    //             nodes[j*length+i].closest_origin = 1;
    //             var new_i = i - origin2.shift_x;
    //             var new_j = j - origin2.shift_y;
    //             if (new_i < 0) new_i = length + new_i;
    //             if (new_j < 0) new_j = height + new_j;
    //             nodes2[j*length+i].path = nodes[new_j*length+new_i].path;

    //             if(i == 0 && j == 0) 
    //             {
    //                 console.log(nodes2[i*length+j]);
    //                 console.log(new_i + " " + new_j);
    //             }

    //             // if(nodes2[j*length+i].path <= nodes[j*length+i].path)
    //             // {
    //             //     nodes[j*length+i].path = nodes2[j*length+i].path;
    //             //     nodes[j*length+i].closest_origin = 2;
    //             // }
    //             // else
    //             // {
    //             //     nodes[j*length+i].closest_origin = 1;

    //             // }

    //             // nodes2[j*length+i].path = Math.abs(i - origin2.shift_x) + Math.abs(j - origin2.shift_y); 

            
    //         }
    //     }

    //     for(j = 0; j < height; j++)
    //     {
    //         for(i = 0; i < length; i++)
    //         {
    //             if(nodes2[j*length+i].path <= nodes[j*length+i].path)
    //             {
    //                 nodes[j*length+i].path = nodes2[j*length+i].path;
    //                 nodes[j*length+i].closest_origin = 2;
    //             }
    //             // nodes2[j*length+i].path = Math.abs(i - origin2.shift_x) + Math.abs(j - origin2.shift_y); 

            
    //         }
    //     }


        

    //      console.log(nodes2);
    //     //  nodes = nodes2;

    //      //too long to explaing what this variable means
    //      const color_divisor = -255/99;


    //     // display calculated values
    //     for(i = 0; i < height*length; i++)
    //     {
            
    //         $( "#" + i ).html( "path: " +  nodes[i].path + " origin: " + nodes[i].closest_origin);
    //     }
        

        
        

    // });

    // console.log("hello world!");
});