$(document).ready(function()
{
    var mode = "hubs_not_selected";
    var hubs_waiting_to_be_selected = 0;
    var nodes2 = new Array();
    var origin2 = new origin();

    const height = 10; 
    const length = 10; 
    


    $( "td" ).on( "click", function( event )
    {
        if(hubs_waiting_to_be_selected > 0)
        {
            // alert("that will be a new hub");
            // $( "#1" ).addClass( "selecting-hub" );
            var id = $(this).attr('id');
            $("#" + id).addClass('selecting-hub');
            origin2.shift_y = Math.floor(id/length);
            origin2.shift_x = id - Math.floor(id/length)*length;
             console.log(origin2);

            hubs_waiting_to_be_selected--;


            //when all the hubs are already selected
            if(!hubs_waiting_to_be_selected)
            {
                $('td').css( 'cursor', 'auto' );
            }
        }
    });


    function node() 
    {
        this.west = 0;
        this.north = 0;
        this.east = 0;
        this.south = 0;
        this.value = 0;
    }

    function origin() 
    {
        this.shift_x = 0;
        this.shift_y = 0;
    }

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

    $("#onSimulate").on( "click", function( event )
    {
        event.preventDefault();
        console.log("Running the simulation!");

        //delesect how many hubs
        $("#inlineFormCustomSelect").val("0");


         var i = x = y = count = path = j = 0;
         var af = xf = yf = 0.0;
        //  var j = 0;

        var nodes = new Array();

        for (i = 0; i < height*length; i++)
        {
            nodes.push(new node());
            nodes2.push(new node());

            
        }

        

        for (j=0; j<height; j++)
        {
            for (i=0; i<length; i++)
            {
                 
                //1st quarter
                if ((j<=(length%2==0 ? Math.floor(length/2) : Math.floor(length/2))) && (i<=(height%2==0 ? Math.floor(height/2-1) : Math.floor(height/2-1))))
                {
                    nodes[y*length+x].value = i*length + j;
                    x = j;
                    y = i;
                    af = (y)/(x);
                    path = y + x;
                    while (path>0)
                    {
                        yf = af*(x);
                        xf = (y)/af;
                        if (((j>=i)&(y-yf<0.5))||((i>j)&(x-xf>0.5)))
                        {
                            //table[nodes[y*length+x].value][nodes[i*length+j].value] = 1;
                            nodes[y*length+x].west++;
                            nodes[y*length+x-1].east++;
                            x--;
                        }
                        else
                        {
                            //table[nodes[y*length+x].value][nodes[i*length+j].value] = 2;
                            nodes[y*length+x].north++;
                            nodes[(y-1)*length+x].south++;
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
                    while (path>0)
                    {
                        yf = af*(length-x);
                        xf = length-(y)/af;
                        if (((i>=length-j)&(y-yf<0.5))||((i<length-j)&(y-yf<-0.5)))
                        {
                            if (x==length-1)
                            {
                                //table[nodes[y*length+x].value][nodes[i*length+j].value] = 3;
                                nodes[y*length+x].east++;
                                x=0;
                                nodes[y*length+x].west++;
                            }
                            else if (x==0)
                            {
                                //table[nodes[y*length+x].value][nodes[i*length+j].value] = 2;
                                nodes[y*length+x].north++;
                                nodes[(y-1)*length+x].south++;
                                y--;
                            }
                            else
                            {
                                //table[nodes[y*length+x].value][nodes[i*length+j].value] = 3;
                                nodes[y*length+x].east++;
                                nodes[y*length+x+1].west++;
                                x++;
                            }
                        }
                        else
                        {
                            if(y==0)
                            {
                                if (x==length-1)
                                {
                                    //table[nodes[y*length+x].value][nodes[i*length+j].value] = 3;
                                    nodes[y*length+x].east++;
                                    x=0;
                                    nodes[y*length+x].west++;
                                }
                                else
                                {
                                    //table[nodes[y*length+x].value][nodes[i*length+j].value] = 3;
                                    nodes[y*length+x].east++;
                                    nodes[y*length+x+1].west++;
                                    x++;
                                }
                            }
                            else
                            {
                                //table[nodes[y*length+x].value][nodes[i*length+j].value] = 2;
                                nodes[y*length+x].north++;
                                nodes[(y-1)*length+x].south++;
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
                    while (path>0)
                    {
                        yf = af*(x);
                        xf = (y)/af;
                        if(((i>j)&(yf-y<0.5))||((i<=j)&(yf-y<-0.5)))
                        {
                        //if ((yf-y<0.5)) {
                            if (x==length-1)
                            {
                                //table[nodes[y*length+x].value][nodes[i*length+j].value] = 3;
                                nodes[y*length+x].east++;
                                x=0;
                                nodes[y*length+x].west++;
                            }
                            else if (x==0)
                            {
                                if (y==height-1)
                                {
                                    //table[nodes[y*length+x].value][nodes[i*length+j].value] = 4;
                                    nodes[y*length+x].south++;
                                    y=0;
                                    nodes[y*length+x].north++;
                                }
                                else
                                {
                                    //table[nodes[y*length+x].value][nodes[i*length+j].value] = 4;
                                    nodes[y*length+x].south++;
                                    nodes[(y+1)*length+x].north++;
                                    y++;
                                }
                            }
                            else
                            {
                                //table[nodes[y*length+x].value][nodes[i*length+j].value] = 3;
                                nodes[y*length+x].east++;
                                nodes[y*length+x+1].west++;
                                x++;
                            }
                        }
                        else if (y==height-1)
                        {
                            //table[nodes[y*length+x].value][nodes[i*length+j].value] = 4;
                            nodes[y*length+x].south++;
                            y=0;
                            nodes[y*length+x].north++;
                        }
                        else if (y==0)
                        {
                            if ((x==length-1))
                            {
                                //table[nodes[y*length+x].value][nodes[i*length+j].value] = 3;
                                nodes[y*length+x].east++;
                                x=0;
                                nodes[y*length+x].west++;
                            }
                            else
                            {
                                //table[nodes[y*length+x].value][nodes[i*length+j].value] = 3;
                                nodes[y*length+x].east++;
                                nodes[y*length+x+1].west++;
                                x++;
                            }
                        }

                        else
                        {
                            //table[nodes[y*length+x].value][nodes[i*length+j].value] = 4;
                            nodes[y*length+x].south++;
                            nodes[(y+1)*length+x].north++;
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
                                    nodes[y*length+x].south++;
                                    y=0;
                                    nodes[y*length+x].north++;
                                }
                                else
                                {
                                    //table[nodes[y*length+x].value][nodes[i*length+j].value] = 4;
                                    nodes[y*length+x].south++;
                                    nodes[(y+1)*length+x].north++;
                                    y++;
                                }
                            }
                            else
                            {
                                //table[nodes[y*length+x].value][nodes[i*length+j].value] = 1;
                                nodes[y*length+x].west++;
                                nodes[y*length+x-1].east++;
                                x--;
                            }
                        }
                        else
                        {
                            if (y==height-1)
                            {
                                //table[nodes[y*length+x].value][nodes[i*length+j].value] = 4;
                                nodes[y*length+x].south++;
                                y=0;
                                nodes[y*length+x].north++;
                            }
                            else if (y==0)
                            {
                                //table[nodes[y*length+x].value][nodes[i*length+j].value] = 1;
                                nodes[y*length+x].west++;
                                nodes[y*length+x-1].east++;
                                x--;
                            }
                            else
                            {
                                //table[nodes[y*length+x].value][nodes[i*length+j].value] = 4;
                                nodes[y*length+x].south++;
                                nodes[(y+1)*length+x].north++;
                                y++;
                            }
                        }
                        path--;
                    }
                }
            }
        }

        for(j = 0; j < height; j++)
        {
            for(i = 0; i < length; i++)
            {
                var new_i = i - origin2.shift_x;
                var new_j = j - origin2.shift_y;
                if (new_i < 0) new_i = length + new_i;
                if (new_j < 0) new_j = height + new_j;
                nodes2[j*length+i] = nodes[new_j*length+new_i];

                if(i == 0 && j == 0) 
                {
                    console.log(nodes2[i*length+j]);
                    console.log(new_i + " " + new_j);
                }

            
            }
        }

         console.log(nodes2);
         nodes = nodes2;

         //too long to explaing what this variable means
         const color_divisor = -255/99;


        // display calculated values
        for(i = 0; i < height*length; i++)
        {
            $( "#" + i ).html( "w:" + nodes[i].west + " n:" + nodes[i].north + " e:" + nodes[i].east + " s:" + nodes[i].south);
            var sum_of_loads = nodes[i].west + nodes[i].north + nodes[i].east + nodes[i].south;
            $( "#" + i ).css('background-color', "rgb(255, " + Math.floor(color_divisor*sum_of_loads + 255) + ", 0)");

        }
        

        
        

    });

    console.log("hello world!");
});