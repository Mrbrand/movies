var itemList = new Carbon("movies");
var itemHistory = new Carbon("mangajo-history");
refresh_list();

items=itemList.get_all();
items.forEach(function(item) {
	if(item.watched == undefined) item.watched = ""
 });
    

// EDIT .subitem-center .title
$(document).on('click', ".subitem-center", function() {
	
	id = $(this).parent().find(".item_id").text();
	edit_item = itemList.get_item(id);

	$(".menu-title").html("Edit: "+edit_item.title);
    
    for (var key in edit_item) {
        $('#edit-groceries-form [name="'+key+'"]').val(edit_item[key]);
    }
    
	
    $(".page").hide();
    $("#edit").show();
	
	$('.more').hide();
	$('.more-button').show();
    
    window.scrollTo(0, 0);
});


// #new-button
$(document).on('click', "#new-button", function() {
	
	$('#new-item-form input[name="title"]').val(""); 
    //$('#new-item-form input[name="postpone"]').val(undefined); 
    $('#new-item-form input[name="notes"]').val(""); 
    $('#new-item-form textarea[name="genre"]').val(""); 
    $('#new-item-form textarea[name="grade"]').val(""); 
	
	$(".page").hide();
	$("#new").show();
});


// .add-button
$(document).on('click', ".add-button", function() {
    itemList.add_from_form("#new-item-form");
    refresh_list();
});


//Sort by
$(document).on('change', "#sortby", function() {
 	refresh_list();
});

// .save-button
$(document).on('click', ".save-button", function() {
    
    itemList.edit_from_form("#edit-groceries-form");
    refresh_list();
    
    //var scroll_offset = $(".item_id:contains('"+id+"')").parent().offset().top-100;
    //window.scrollTo(0, scroll_offset);
});


// .more-button
$(document).on('click', ".more-button", function() {
	$('.more').show();
	$('.more-button').hide();
});
 
 
// .cancel-button
$(document).on('click', ".cancel-button", function() {
    
    itemList.edit_from_form("#edit-groceries-form");
    refresh_list();
    
    //var scroll_offset = $(".item_id:contains('"+id+"')").parent().offset().top-100;
    //window.scrollTo(0, scroll_offset);
});

// .delete-button
$(document).on('click', ".delete-button", function() {
	id = $("#edit-groceries-form .item-id").val();
    if (confirm('Delete "'+itemList.get_item(id).title+'"?')==true) {
    itemList.remove_item(id);
    refresh_list();
    }
});




//refresh list
function refresh_list(){
  
    var query = $("#quick_search").val().toLowerCase();
    var sortby = $("#sortby").val();
    
    open_items=itemList.get_all();
    //open_items=open_items.query("prio", "==", undefined);
    //open_items=open_items.query("title", "contains", query);
    
    open_items=open_items.filter(function (item){
		 	return item['title'].toLowerCase().indexOf(query) != -1 || item['notes'].toLowerCase().indexOf(query) != -1 
		});
    
    
    
    finished_items=itemList.get_all();
    finished_items=finished_items.query("status", "==", "finished"); 
    //finished_items=finished_items.query("prio", "==", undefined);
    finished_items=finished_items.query("title", "contains", query);
    
    //sortera fltered items
    open_items.sort(
        firstBy("grade", -1)
        .thenBy("title") 
	);
	
	if(sortby=="title"){ 
		open_items.sort(
		    firstBy("title") 
		);
	}
	
	else if(sortby=="watched"){
		open_items.sort(
		    firstBy("watched", -1)
		    .thenBy("grade") 
		);
	}
	
	
	else{
		open_items.sort(
		    firstBy("grade", -1)
		    .thenBy("title") 
		);
	}
	
  	//mustache output
   	$("#open_items").empty();    
  	open_items.forEach(function(item) {
		var template = $('#open_items_template').html();
		var html = Mustache.to_html(template, item);
		$("#open_items").append(html);
	});
	
 
  	//om inga items hittas
	if (open_items.length == 0 && finished_items.length == 0) $("#open_items").append("<div class='empty'>No items here</div>");
    
    $(".page").hide();
	$("#search").show();
}

// gear button (preferences)
$(document).on('click', ".pref-button", function(){  
        $(".page").hide();
		$("#menu").show();
});

// #import-button
$(document).on('click', "#import-button", function() {
    if (confirm('All current data will be deleted?')==true) {
        window.localStorage.setItem(itemList.storageKey, $('#import').val());
       	refresh_list();
    }
});
 
// #export all-button
$(document).on('click', "#export-button", function() {
    var items = itemList.get_all();
    var items_string = JSON.stringify(items);
    $("#export").html(items_string);
    $(".page").hide();
    $("#export").show();
});


// #clear history
$(document).on('click', "#clear-history-button", function() {
 	window.localStorage.setItem(itemHistory.storageKey, "[]");
});



