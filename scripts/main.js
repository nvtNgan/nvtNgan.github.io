/*title
var svg_ti = d3.select("#title").append("svg")
    .attr("width","100%").attr("height","30px");
    svg_ti.append("rect").attr("width","100%")
    .attr("height","30px").attr("background","#000");*/
//body
var margin = {top: 0, right: 0, bottom: 0, left: 0};
var width = document.body.clientWidth - margin.left - margin.right;
var height = 750 - margin.top - margin.bottom;

var wtree_b_g = width*0.25;
var htree_b_g = width*0.125;
var mtree_g = {top: 10, right: 50, bottom: 50, left: 50};
var wtree_g = wtree_b_g-mtree_g.left-mtree_g.right;
var htree_g = htree_b_g-mtree_g.top-mtree_g.bottom;

var wtree_b = width*0.25;
var htree_b = height-htree_b_g;
var mtree = {top: 10, right: 50, bottom: 0, left: 50};
var wtree = wtree_b-mtree.left-mtree.right;
var htree = htree_b-mtree.top-mtree.bottom;

var wgroup = width-wtree-mtree.left-mtree_g.right;
var hgroup = height;
var bar_pos = [{x1:0, y1:height,x2:0, y2:0}];

var wtime = 300;
var htime = 50;
var mtime = {top: (hgroup-htime), right: 0, bottom: 0, left: (wgroup-wtime)};
d3.select("#container").append("div").attr("id","group").attr("class","group").style("left",(margin.left+wtree_b)+"px");
var svg = d3.select("#group").append("svg")
    .attr("width", wgroup)
    .attr("height", hgroup)
var svg_graph = d3.select("#treemap_graph").append("svg")
   // .style("background", "#eed")

    .attr("width", wtree_b_g)
    .attr("height", htree_b_g)
    .append("g")
    .attr("width", wtree_b_g)
    .attr("height", htree_b_g);

d3.select("#treemap_main").append("div").attr("id","treemap_tree").attr("class","treemap_tree").style("top",(margin.top+htree_b_g)+"px");
var svg4 = d3.select("#treemap_tree")
	.append("svg")
    .style("position", "absolute")
    .attr("width", wtree_b)
    .attr("height", htree_b)
    .append("g")
    .attr("width", wtree_b)
    .attr("height", htree_b)
    .attr("transform", "translate(" + [mtree.left, mtree.top] + ")");
var svg_bar = d3.select("#treemap_bar").append("svg")
   // .style("background", "#eed")
    .attr("width", wtree_b)
    .attr("height", height);
    //.attr("transform", "translate(" + [mtree_g.left, mtree_g.top] + ")");
var color = d3.scaleOrdinal(d3.schemeCategory10);


var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) { return d.id; }))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter((width-wtree_b)/2, height/2));
var tree = d3.cluster()
    .size([htree, wtree])
    .separation(function(a, b) { return 1; });
var bar = svg_bar.append("g")
      .attr("class", "bar")
      .attr("transform", "translate(" + [mtree_g.left, mtree_g.top] + ")");
var bar_l1 = bar
    .append("line")
    .classed('b',true)
    .data(bar_pos)
     .style("stroke-dasharray",  "4, 2")
     .style("stroke-width", "2px")
    .attr("x1", function(d) { return d.x1; })
    .attr("y1", function(d) { return d.y1; })
    .attr("x2", function(d) { return d.x2; })
    .attr("y2", function(d) { return d.y2; });
var bar_l2 = bar.append("line")
    .classed('a',true)
    .data(bar_pos)
    .style("opacity",  "0")
    .attr("x1", function(d) { return d.x1; })
    .attr("y1", function(d) { return d.y1; })
    .attr("x2", function(d) { return d.x2; })
    .attr("y2", function(d) { return d.y2; });
var focus;    
var tree_dx;
var node2;
var node;
var roots;
var tree_deep_cv;
var radius = 6;
/*
<<<<<<< HEAD

=======
>>>>>>> f41cb8646193b11f7aab076bf481cc71363c0550*/
d3.json("data/dataset3.json", function(error, graph) {
if (error) throw error;
var num_n = graph.nodes.length;
var start_time = performance.now();
//processing
	var step = between_e(graph);
var end_time_b = performance.now();
	var max_lv=step.length+1;
// tree
	var tree_hi = tree_mapingv3(step,graph);
var end_time_t = performance.now();
	var tree_deep = d3.scaleLinear().domain([tree_hi[0].depth,0]).range([0,wtree]); 
	tree_deep_cv = d3.scaleLinear().domain([tree_hi[0].depth,0]).range([0,tree_hi[1].length]); 
	tree_dx = wtree/tree_hi[1].length;
//end
	roots = d3.hierarchy(tree_hi[0]);
	tree(roots);
	var link2 = svg4.selectAll(".link")
	  .data(roots.descendants().slice(roots.name=="join all"?roots.children.length:1))
	  .enter().append("path")
	  .attr("class", "link")
	  .attr("d", function(d) {
	    return "M" + [tree_deep(d.data.depth), d.x]
           + "L" + [tree_deep(d.parent.data.depth), d.x]
           + "L" + [tree_deep(d.parent.data.depth), d.parent.x];
	        /*+ "C" + [(tree_deep(d.parent.data.depth)+tree_deep(d.data.depth))/2, d.x]
	        + " " + [tree_deep(d.parent.data.depth), (d.x+d.parent.x)/2]
	        + " " + [tree_deep(d.parent.data.depth), d.parent.x];*/
	  })
	  .attr("stroke", function(d) { return color(1); });

	function size_scale (){
		if (num_n*2*4<htree)
			return 1;
		else
			return htree/(num_n*2*4);
	} 
	var resize = size_scale();

	node2 = svg4.selectAll(".node")
	      .data(roots.leaves(),function(d) { return d.data.name; })
	      .enter().append("g")
	      .attr("class", " node--leaf")
	      .attr("transform", function(d) { return "translate(" + [tree_deep(d.data.depth), d.x] + ")"; });
	node2.append("circle")
	      .attr("r", resize*4)
	      .attr("fill", function(d) { return color(1) });

	node2.append("text")
	      .attr("y", resize*4)
	      .attr("x", resize*4+1)
	      //.style("text-anchor", "end")
	      .style("font-size",9.5*resize+"px")
	      //.attr("transform", function(d) { return "rotate(" + (0) + ")"; })
	      .text(function(d) { return d.data.name; });

	var clusterbox = d3.select("#treemap_tree").append("rect")
	      .attr("class","clusterbox")
	      .style("display","none");
	clusterbox.append("text");
	var time_box = svg.append("g")
		//.attr("transform","translate(" + mtime.left +","+ mtime.top + ")");

        .attr("class","timebox")
		.attr("width",wtime)
		.attr("height",htime)
		.attr("transform","translate(" + mtime.left +","+ mtime.top + ")");
		time_box
		.append("text")
		.text("Computing time for betweenness edge: "+Math.round(end_time_b-start_time)+ " ms");
		time_box
		.append("text")
		.attr("transform","translate(" + 0 +","+ 15 + ")")
		.text("Computing time for Modularity Q: "+Math.round(end_time_t - end_time_b+start_time)+ " ms");
  //-------------graph
  	var domain = {x:{min:0,max:0},y:{min:0,max:0}}; 
  	domain.y.min = d3.min(tree_hi[1]);
  	domain.y.max = (d3.max(tree_hi[1])-d3.min(tree_hi[1]))*1.1+d3.min(tree_hi[1]);

	var y_range = d3.scaleLinear().domain([domain.y.min, domain.y.max]).range([htree_g, 0]);
	var x_range = d3.scaleLinear().domain([tree_hi[1].length,1]).range([wtree_g, 0]);
	var max_Q = {pos:0,val:tree_hi[1][0]};
	var line_g = d3.line()
	    .x(function(d,i) { if(d>max_Q.val){max_Q.val = d; max_Q.pos = i} return x_range(tree_hi[1].length-i); })
	    .y(function(d) { return y_range(d); });
	svg_graph.append("g")
	  .attr("class", "axis axis--x")
	  .attr("transform", "translate(" + [mtree_g.left, mtree_g.top+htree_g] + ")")
	  .call(d3.axisBottom(x_range));
	svg_graph.append("g")
	  .attr("class", "axis axis--y")
	  .attr("transform", "translate(" + [mtree_g.left, mtree_g.top] + ")")
      .call(d3.axisLeft(y_range));

	svg_graph.append("path")
      .attr("class", "graph")
      .attr("transform", "translate(" + [mtree_g.left, mtree_g.top] + ")")
      .data([1])
  		.attr("d", line_g(tree_hi[1]));

  	svg_graph.append("text")
  	        .attr("text-anchor", "middle")
            .attr("transform", "translate("+ [mtree_g.left-35, mtree_g.top+htree_g/2] +")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
            .text("Modularity - Q");
    svg_graph.append("text")
  	        .attr("text-anchor", "middle")
            .attr("transform", "translate("+ [mtree_g.left+wtree_g/2, mtree_g.top+htree_g+35]+")")  // text is drawn off the screen top left, move down and out and rotate
            .text("Number of clusters");

  	focus = svg_graph.append("g")
  	.attr("transform", "translate(" + [mtree_g.left, mtree_g.top] + ")")
  	.append("g")
      .attr("class", "focus")

      .style("display", "none");

	focus.append("circle")
	  .attr("r", 4.5);

	focus.append("text")
	  .attr("x", 9)
	  .attr("dy", ".35em");

	focus.append("line")
      .classed("x", true)
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("stroke-width", "1.5px")
      .attr("stroke-dasharray", "3 3");

  	/*svg_bar.append("rect")
      .attr("class", "overlay")
      .attr("width", wtree_g)
      .attr("height", htree_g)
      .attr("transform", "translate(" + [mtree_g.right, mtree_g.top] + ")")
      .on("mouseover", function(d){ focus.style('display', null)})
      .on("mouseout", function(d){focus.style('display', 'none')})
      .on("mousemove", mousemove);
    function mousemove() {
	    var x0 = Math.round(x_range.invert(d3.mouse(this)[0]));
	        d = y_range(tree_hi[1][x0]);
	    focus.attr("transform", "translate(" + x_range(x0)+ "," + (d ) + ")");
	    focus.select("text").text(tree_hi[1][x0]);
	    focus.select("line.y")
	    .attr("x1",0)
	    .attr("y1",0)
	    .attr("x2",0)
	    .attr("y2",d);
  	}*/

  //---------------node   
  var link = svg.append("g")
      .attr("class", "links")
    .selectAll("line")
    .data(graph.links)
    .enter().append("line")
      .attr("stroke-width", function(d) { return Math.sqrt(d.value); });

  node = svg.append("g")
      .attr("class", "nodes")
    .selectAll("circle")
    //.data(graph.nodes)
    .data(graph.nodes,function(d) { return d.id; })
    .enter().append("circle")
      .attr("r", 5)
      .attr("fill", function(d) { return color(d.group); })
      .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended));

  node.append("title")
      .text(function(d) { return d.name!=null?d.name:d.id; });
  node.append("text")
    .attr("dx", 12)
    .attr("dy", ".35em")
    .text(function(d) { return d.name!=null?d.name:d.id; });
  simulation
      .nodes(graph.nodes)
      .on("tick", ticked);

  simulation.force("link")
      .links(graph.links);

  function ticked() {
  	node
        .attr("cx", function(d) { return d.x = Math.max(radius, Math.min(wgroup - radius, d.x)); })
        .attr("cy", function(d) { return d.y = Math.max(radius, Math.min(hgroup - radius, d.y)); })
        .attr("fill" , function(d){ return color(d.group)});
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });
  }
  //---------------------init bar
	bar_l2.attr("transform", function(d){
        return "translate(" + [ x_range(tree_hi[1].length-max_Q.pos),0 ] + ")"});
	bar_l1.attr("transform", function(d){
        return "translate(" + [ x_range(tree_hi[1].length-max_Q.pos),0 ] + ")"});
	var x0 = x_range(tree_hi[1].length-max_Q.pos);
        y0 = y_range(max_Q.val);
		    focus.attr("transform", "translate(" + x0 + "," + y0 + ")");
		    focus.select("text").text(max_Q.val);
		    focus.select("line.x")
		    .attr("x1",0)
		    .attr("y1",0)
		    .attr("x2",-x0)
		    .attr("y2",0);    
   	bar_l2.attr("x1",function(d){d.x1 = x0; return bar_pos.x1});
  var numofg=1;
  update_group(tree_hi[1].length-max_Q.pos-1);
  //---------------
  bar_l2.call(d3.drag()
	.on("start", dragstarted_bar)
	.on("drag", dragged_bar)
	.on("end", dragended_bar))
    .on("mousemove",dragstarted_bar)
    .on("mouseout",mouseout);

  function mouseout(d){
  	bar_l2.style("opacity", "0");
	focus.style('display', "none");
	clusterbox.style("display","none");
  }
  function dragstarted_bar(d) {
  	bar_l2.style("opacity", "0.5"); 
	focus.style('display', null);
	clusterbox.style("display",null);
	var x0 = Math.round(x_range.invert(d.x1));
        d = y_range(tree_hi[1][tree_hi[1].length-x0]);
    focus.attr("transform", "translate(" + x_range(x0)+ "," + (d ) + ")");
    focus.select("text").text(tree_hi[1][tree_hi[1].length-x0]);
    focus.select("line.x")
    .attr("x1",0)
    .attr("y1",0)
    .attr("x2",-x_range(x0))
    .attr("y2",0);
  }

	function dragged_bar(d) {
		bar_l2.on("mouseout",null)
	  d.x1 += d3.event.dx;
	  if (d.x1<=0)
	  	d.x1 = 0;
	  else{
	  	if (d.x1>= wtree)
	  		d.x1 = wtree;
	  	
	  	else
	  	{
	  		bar_l2.attr("transform", function(d){
	                return "translate(" + [ d.x1,0 ] + ")"});
	  		bar_l1.attr("transform", function(d){
	                return "translate(" + [ d.x1,0 ] + ")"});
	  	}
	  	
	  }
	  var x0 = Math.round(x_range.invert(d.x1));
		        d = y_range(tree_hi[1][tree_hi[1].length-x0]);
		    focus.attr("transform", "translate(" + x_range(x0)+ "," + (d ) + ")");
		    focus.select("text").text(tree_hi[1][tree_hi[1].length-x0]);
		    focus.select("line.x")
		    .attr("x1",0)
		    .attr("y1",0)
		    .attr("x2",-x_range(x0))
		    .attr("y2",0);
	  //d.x2 = d.x1;   
	}

	function dragended_bar(d) {
		bar_l2.style("opacity", "0")
		.on("mouseout",mouseout);;
			focus.style('display', "none");
		var depth = Math.round(x_range.invert(d.x1))-1;
		if (depth<0)
			depth=0;
		//update_group(depth tree_hi[1].length-max_Q.pos-1);
		  update_group(depth);
	}

	function update_group(depth){
		var cg = 0;
		  var leave=[];
		  var node_t=[];
		  node_t.push(roots);
		  while (node_t.length!=0){
		  	var node_t_t = node_t.pop();
		  	if (tree_deep_cv(node_t_t.data.depth)<depth)
		  	{
		  		if (node_t_t.children!=null)
					node_t = node_t_t.children.concat(node_t);
				else
					leave.push(node_t_t);	
			}else{
				leave.push(node_t_t);
			}
		  }
		  numofg=leave.length;
		  clusterbox.select("text").text("# of clusters : "+leave.length+" | Q : "+Math.round(tree_hi[1][tree_hi[1].length-1-depth]*1000)/1000);
		  for (var j=0;j<leave.length;j++){
		  	//update for tree windown
			node2.data(leave[j].leaves(), function(d) { return d.data.name; })
			.selectAll("circle")
			.attr("fill",function(d) { return color(j); });
			var node_temp=[];
			link2.data(leave[j].descendants(), function(d) { return d.data.name; })
			.attr("stroke",function(d) { return color(j); });
			//update for right group windown
			leave[j].leaves().forEach(function (e){
				simulation.nodes().filter(function(n){
					if ((n.name!=null)&&(n.name==e.data.name)||(n.id==e.data.name))
					{
						n.group=j;
						node_temp.push(n);
					}
				})
			});
			node.attr("fill" , function(d){ return color(d.group)});
			}
	}
});

function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}



function findbi(e,key,start,end){
  while (start<=end){
    var p = Math.floor((start+end)/2);
    if (e.links[p].source<key){
      start=p+1;      
    }else{
      if (e.links[p].source>key){
        end=p-1;
      }else{
        return p;
      }
    }
  }
  return -1;
}

function findnei(a,key,av){
  var nei=[];
  if (key[1])//virtual node
  {
  	if (a[a[2]][a[0]]>0){//virtual node next
	  	a[a[2]][a[0]] -=av;
	  	a[a[0]][a[2]] -=av;
	  	nei.push(key);
  	}else{
  		nei.push([a[0],false,a[2]]);
  	}
  }else{
	  for (var i=0;i<a[0].length;i++){
	    if (a[key[0]][i]>0){
	    	if (a[key[0]][i]>av)
	      		nei.push([i,true,key[0]]);// virtual node 
	      	else
	      		nei.push([i,false,key[0]]);
	      a[key[0]][i]-=av;
	      a[i][key[0]]-=av;
	    }
	  } 
	}
  return nei;
}

function init(m,n){
    var ar= [];
    for (var i = 0; i < m; i++) {
      var art=[];
      for (var j = 0; j < n; j++) {
        art.push(0);
      }
      ar.push(art);
    }
    return ar;
  }

function init_empty(m){
    var ar= [];
    for (var i = 0; i < m; i++) {
      var art=[];
      ar.push(art);
    }
    return ar;
  }

function a_array(ee){
  var a = init(ee.nodes.length,ee.nodes.length);
  ee.links.forEach(function(e){
  	var ii=0;
  	var jj=0;
  	ee.nodes.filter(function(n,i){
	  if (e.source==n.id)
	    ii=i;
	  else
	  	if (e.target==n.id)
	  		jj=i;
	});
	a[ii][jj]=e.value;
	a[jj][ii]=e.value;
	});
  return a;
}

function a_array_av(ee){
  var a = init_empty(ee.nodes.length);
  var sum = 0;
  var m = ee.links.length;
  ee.links.forEach(function(e){
  	var ii=0;
  	var jj=0;
  	ee.nodes.filter(function(n,i){
	  if (e.source==n.id)
	    ii=i;
	  else
	  	if (e.target==n.id)
	  		jj=i;
	});
	sum = sum + (1/e.value);
	a[ii].push({nei: jj,val: 1/e.value});
	a[jj].push({nei: ii,val: 1/e.value});
    
	});
  return [a,sum/m];
}



function calculate_m(ee){
  var sum = 0;
  var m = ee.links.length;
  ee.links.forEach(function(e){
  	var ii=0;
  	var jj=0;
  	ee.nodes.filter(function(n,i){
	  if (e.source==n.id)
	    ii=i;
	  else
	  	if (e.target==n.id)
	  		jj=i;
	});
	sum = sum+e.value;
    
	});
  return [sum];
}

function a_array_ext(arr,av){
	var l = arr.length;
	for (var iii=0;iii<l;iii++){
		for (var jjj=0; jjj<arr[iii].length;jjj++)
		{
			var n = Math.round(arr[iii][jjj].val/av);
			var nei = arr[iii][jjj].nei;
			if (n>1)
			{
				arr[iii][jjj].nei = arr.length;
				arr[iii][jjj].val = av; 
				arr.push([{nei: iii, val: av},{nei: nei,val: av}]);
				for (var z = 2; z<n;z++)
				{
					var ll = arr.length;
					arr[ll-1][1].nei = ll;
					arr.push([{nei: ll-1, val: av},{nei: nei,val: av}]);
				}
				arr[nei].filter(function(n,i){
					if (n.nei==iii){
						n.val = av; 
						n.nei = arr.length-1;//last virtual node
					}
				});
			}
		}
	}
	return [arr,av];
}

function finditem(grouping,li,graph){
  var g1=-1;
  var g2=-1;
  for (var i=0;(i<grouping.length)&&(g1==-1||g2==-1);i++){
    for (var j=0;(j<grouping[i].length)&&(g1==-1||g2==-1);j++){ 
      if (g1==-1&&grouping[i][j]==graph.nodes[li[0]].id)
          g1=i;
      if (g2==-1&&grouping[i][j]==graph.nodes[li[1]].id)
          g2=i;
    }
  }
  return [g1,g2];
}

function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}


function copyA(a){
	var b=[];
	a.forEach(function(e){
		var bb=[];
		e.forEach(function(e){
			bb.push(clone(e));	
			});
		b.push(bb);
	});
	return b;
}
//virtual nodes
function between_e(graph){
  var alink_o = a_array_av(graph); // orgiginal
  var av = alink_o[1];
  alink_o = alink_o[0];
  var num_n = graph.nodes.length;// num of node
  var step=[];
  var num_l = graph.links.length;
  while (step.length!=graph.links.length){
  	var alink_oc = copyA(alink_o);
  	//document.write("</br> old array size: "+alink_o[3][0].nei);
  	var alink_fix = a_array_ext(alink_oc,av); // add virtual nodes
  	//document.write("</br> old array size: "+alink_o[3][0].nei);
  	var alink = alink_fix[0]; //fixed
    // calculate
    var ebs=init(num_n,num_n);
    var max_ebs=[0,0,0];
    for (var s = 0; s < num_n; s++) {
      var S=[];
      var Leaf=[];
      var Pathu=[];
      var Pathd=[];
      var d=[];
      var w=[];
      d[s]=0;
      w[s]=1;
      var Q=[];
      Q.push(s);
      while (Q.length!=0){
        var i = Q.shift();
        S.push(i);
        var l=Q.length;
        //document.write("</br>"+i+": ");
        alink[i].forEach(function(e){
        	var j = e.nei;
			if (d[j]==null){
				d[j]=d[i]+1;
				w[j]=w[i];
				Q.push(j);

				if (i<num_n){//not virtual node
				  	Pathu[j]=[i];
				  }else{
				  	Pathu[j]=Pathu[i];
				  }
				if (j<num_n) {//not virtual node
					if (Pathd[i]==null)
					Pathd[i]=[j];
					else
					Pathd[i].push(j);

				}else{
					if (Pathd[i]==null)
						Pathd[i]=Pathd[j];
					else
					Pathd[i].concat(Pathd[j]);              	
					}

			}else{
				if (d[j]==d[i]+1){
				  w[j]=w[j]+w[i];
				  if (i<num_n){//not virtual node
				  	Pathu[j].push(i);
				  }else{
				  	Pathu[j].concat(Pathu[i]);
				  }
				  if (j<num_n) {//not virtual node
				  	if (Pathd[i]==null)
				    	Pathd[i]=[j];
				  	else
				    	Pathd[i].push(j);

				  }else{
					if (Pathd[i]==null)
				    	Pathd[i]=Pathd[j];
				  	else
				    	Pathd[i].concat(Pathd[j]);              	
				  }
				}
	        }//document.write("</br>"+" - "+e.nei+": "+"d :"+d[e.nei]+"w :"+w[e.nei]);
	    });
        if (Q.length ==l&&(i!=s)&&(i<num_n))
          Leaf.push(i);
  	}
      var eb=init(num_n,num_n);
      //Leaf
      while(Leaf.length!=0){
        var t=Leaf.pop();
        while (Pathu[t].length!=0){
          var i = Pathu[t].pop();
          eb[i][t] += w[i]/w[t];
          eb[t][i] += w[i]/w[t];
          ebs[i][t] += w[i]/w[t];
          ebs[t][i] += w[i]/w[t];
          if (ebs[i][t]>max_ebs[0]){
            max_ebs[0]=ebs[i][t];
            max_ebs[1]=i;
            max_ebs[2]=t;
          }
        }
      }
      //cont
      while (S.length!=0){
        var j = S.pop();
        if (j<num_n){
	        if (Pathd[j]!=null)
	        {
	          var sumb=1;
	          while (Pathd[j].length!=0){
	            var jj = Pathd[j].pop();
	            sumb+=eb[j][jj];
	          }
	          if (Pathu[j]!=null)
	          {
	            while (Pathu[j].length!=0){
	              var i = Pathu[j].pop();
	              eb[i][j]+=w[i]/w[j]*sumb;
	              eb[j][i]+=w[i]/w[j]*sumb;
	              ebs[i][j]+=w[i]/w[j]*sumb;
	              ebs[j][i]+=w[i]/w[j]*sumb;
	              if (ebs[i][j]>max_ebs[0]){
	                max_ebs[0]=ebs[i][j];
	                max_ebs[1]=i;
	                max_ebs[2]=j;
	              }
	            }
	          }
	      	}
        }
      }
    }
    if (max_ebs[0]!=0){
      step.push([max_ebs[1],max_ebs[2]]);
      av = av*num_l;

      for (var i =0;i<alink_o[max_ebs[1]].length;i++){
      	 //document.write("</br>"+"-- "+ alink_o[max_ebs[1]][i].nei);
      	if (alink_o[max_ebs[1]][i].nei== max_ebs[2]){
      		av = av - alink_o[max_ebs[1]][i].val;
			num_l--;
			av = av/num_l;
			alink_o[max_ebs[1]].splice(i,1);
			break;
      	}
      }

      for (var i =0;i<alink_o[max_ebs[2]].length;i++){
      	 //document.write("</br>"+"--- "+ alink_o[max_ebs[2]][i].nei);
      	if (alink_o[max_ebs[2]][i].nei== max_ebs[1]){
			alink_o[max_ebs[2]].splice(i,1);
			break;
      	}
      }
    }
    //document.write("----step: "+ step+"  av"+av);
  }
  return step;
}

function Q_init(A,m,a_e){
	var n = A.length;
	var Q = 0;
	for  (var i = 0;i<n;i++){
		var sum = 0;
		for (var j = 0;j<n;j++){
			sum +=A[i][j];
		}
		a_e.push(sum/2/m);
		Q-=Math.pow(sum/2/m,2);
	}
	return Q;
}

function delta_Q(i,j,m,A,a_e){
	var n = A.length;
	var delta_Q = 2*(A[i][j]/2/m-a_e[i]*a_e[j]);
	//update
  	A[i][i] += A[j][j]+A[i][j]+A[j][i];
  	A[j][j] = 0;
  	A[j][i] = 0;
  	A[i][j] = 0;
  	var sum = A[i][i];
	for  (var k = 0;k<n;k++){
		if (k!=i && k!=j){
			A[i][k] += A[j][k];
			A[k][i] = A [i][k];
			A[j][k] = 0;
			sum += A[i][k]*2; 
		}
	}
	a_e[i] = sum/2/m;
	a_e[j] = 0;
	return delta_Q;
}

function tree_mapingv3(step,graph){
  var grouping = [];	
  var ed = step.pop();
  var lv = 1;
  var m = calculate_m(graph);
  var A = a_array(graph);
  var a_e = [];
  var Q = [];
  var Q_t = Q_init(A,m,a_e);
  Q.push(Q_t);
  grouping.push([graph.nodes[ed[0]].id,graph.nodes[ed[1]].id]);
  // join 2 nodes together
  Q_t +=  delta_Q(ed[0],ed[1],m,A,a_e);
  //----
  Q.push(Q_t);
  var hi=[{name: [ed[0],ed[1]],children: [{name: graph.nodes[ed[0]].name!=null?graph.nodes[ed[0]].name:graph.nodes[ed[0]].id, depth: 0},{name: graph.nodes[ed[1]].name!=null?graph.nodes[ed[1]].name:graph.nodes[ed[1]].id, depth: 0}], depth: lv, Q: Q_t}];
  while (step.length!=0){
    var li=step.pop();
    // 4 main case
	for (var i=0;i<grouping.length;i++){
    	var g=finditem(grouping,li,graph);}

	var g1=g[0];
	var g2=g[1];
	if (g1!=g2){
		lv++;
	  if (g1!=-1&&g2!=-1){
	    // 2 groups -> new group
	    //Q
	    Q_t += delta_Q(grouping[g1][0],grouping[g2][0],m,A,a_e);
	    Q.push(Q_t);
	    //move
	    grouping.splice(g1,1,grouping[g1].concat(grouping[g2]));
	    grouping.splice(g2,1);
	    var hi_t=[];
	    hi_t.push(hi[g1]);
	    hi_t.push(hi[g2]);
	    hi[g1]={name: li,children: hi_t,depth: lv, Q: Q_t};
	    hi.splice(g2,1);
	    //document.write("case 1 "+g1+" "+g2+"   "+JSON.stringify(hi)+"</br>");
	  }else{
	    // 1 element + 1 group -> new group
	    var li_t= li;
	    if (g2==-1){// li[1] is new element
	      li_t[0]=li_t[1];
	    }else{
	      g1=g2;
	    }
	    //Q
	    Q_t += delta_Q(grouping[g1][0],li[0],m,A,a_e);
	    Q.push(Q_t);
	    //move
	    grouping[g1].push(li[0]);
	    hi[g1]={name: li,children: [hi[g1]], depth: lv, Q:Q_t};
	    hi[g1].children.push({name: graph.nodes[li_t[0]].name!=null?graph.nodes[li_t[0]].name:graph.nodes[li_t[0]].id , depth: 0});
	    //document.write("case 2 "+JSON.stringify(hi)+"</br>");
	  }
	}else{
	  if (g1==-1)
	  {
	  	lv++;
	  	//Q
	    Q_t += delta_Q(li[0],li[1],m,A,a_e);
	    Q.push(Q_t);
	    //move
	    grouping.push(li);
	    hi.push({name: li,children: [{name: graph.nodes[li[0]].name!=null?graph.nodes[li[0]].name:graph.nodes[li[0]].id, depth: 0},{name: graph.nodes[li[1]].name!=null?graph.nodes[li[1]].name:graph.nodes[li[1]].id, depth: 0}], depth: lv, Q: Q_t});
	    //document.write("case 3 "+JSON.stringify(hi)+"</br>");
	  }
	}
  }
  if (hi.length==1){
    return [hi[0],Q];
  }
  else{
  	hi[0]={name: "join all",children: [hi[0]],depth: lv+1, Q: Q_t};
  	while (grouping.length != 1){
	  	Q_t += delta_Q(grouping[0][0],grouping[1][0],m,A,a_e);
	  	grouping.splice(0,1,grouping[0].concat(grouping[1]));
	    grouping.splice(1,1);
	    hi[0].children.push(hi[1]);
    	hi.splice(1,1);
	}
	Q.push(Q_t);
    return [hi[0],Q];
  }
}