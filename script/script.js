(function(){

	if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
 		width_block_default = 800;		
	}
	else width_block_default = 400;
	

	NodeList.prototype.forEach = Array.prototype.forEach;
	var marginSection = 20;
	var numberColumn = 3;
	var widthSection = 1320;
	var numberClips;
	var clips = [];
	var nextPage = "";
	var query = "";
	var additionally_download = 0;
	numberPages = 0;
	currentPage = 0;


	var header = document.createElement("header");
	document.body.appendChild(header);

	var input = document.createElement("input");
	input.placeholder = "Search on youtube";
	input.type = "search";
	input.onkeypress  = function (e){
		e = e || window.event;
        if (e.keyCode == 13){
            query = e.target.value;
			newClipList();
        }
	}
	header.appendChild(input);
	
	main_section = document.createElement("section");
	main_section.id = "main_section";
	document.body.appendChild(main_section);
	main_section.onmousedown = function(){ return false; };
	main_section.onselectstart = function(){ return false; };

	footer = document.createElement("footer");
	document.body.appendChild(footer);

	function convertYouTubeResponseToClipList(rawYouTubeData) {
		var clipList = [];
		var entries = rawYouTubeData.items;
		if (entries) {
			for (var i = 0, l = entries.length; i < l; i++){
				var entry = entries[i];
				var date = new Date(Date.parse(entry.snippet.publishedAt));
				var shortId = entry.id.videoId;
				clipList.push({
					id: shortId,
					youtubeLink: "http://www.youtube.com/watch?v=" + shortId,
					title: entry.snippet.title,
					thumbnail: entry.snippet.thumbnails.high.url,
					description: entry.snippet.description,
					author: entry.snippet.channelTitle,
					publishDate: (date.getMonth() + 1) + "." + date.getDate() + "." + date.getFullYear()
				});
			}
		}
		nextPage = rawYouTubeData.nextPageToken;
		return clipList;
	}

	jsonpCallback = function(rest){
		result = convertYouTubeResponseToClipList(rest);
		result.forEach(function(item){ searchStatistics(item.id); clips.push(item); });
	}	
	jsonpStatistic = function(rest){
		flag = true;
		result.forEach(function(item, i) { 
			if (item.id == rest.items[0].id) item.viewCount = rest.items[0].statistics.viewCount; 
			if (!item.viewCount) flag = false;
		});
		if (flag) addClipsToDocument(result);
	}
	function searchStatistics(id) {
		var elem = document.createElement("script");
		elem.src = "https://www.googleapis.com/youtube/v3/videos?callback=jsonpStatistic&part=statistics&key=AIzaSyB7SGCLcruOGtri-GJS-kTJFcFj6xtCMwc&id="+id;
		document.head.appendChild(elem);
	}
	function searchByKeyword(src, number, nextPage) {
		if (number == 0) return;
		var elem = document.createElement("script");
		number = "&maxResults="+number;
		if (!nextPage) nextPage = "";
		else nextPage = "&pageToken="+nextPage;
		elem.src = "https://www.googleapis.com/youtube/v3/search?callback=jsonpCallback&part=snippet&type=video&key=AIzaSyB7SGCLcruOGtri-GJS-kTJFcFj6xtCMwc&q="+src+number+nextPage;
		document.head.appendChild(elem);
	}

	function clear_clips(){
		document.body.removeChild(main_section);
		document.body.removeChild(footer);

		main_section = document.createElement("section");
		main_section.id = "main_section";
		document.body.appendChild(main_section);
		main_section.onmousedown = function(){ return false; };
		main_section.onselectstart = function(){ return false; };

		footer = document.createElement("footer");
		document.body.appendChild(footer);
	}

	function margin_section(){
		return parseInt((main_section.clientWidth - numberColumn*width_block_default)/2/numberColumn);
	}

	function margin_for_section(){
		var sections = document.querySelectorAll("#main_section>section");
		sections.forEach(function(item) { item.style.margin = "20px " + marginSection + "px"; });
	}

	function number_column(){
		return parseInt(main_section.clientWidth/(width_block_default+40));
	}

	function newClipList(){
		clear_clips();
		currentPage = 0;
		numberPages = 0;
		numberClips = 0;
		clips = [];
		update_width();
		addClipsPages();
		searchByKeyword(query, numberColumn);
		numberClips += numberColumn;
	}

	translatex = function (num_page){
		var width = (widthSection*numberColumn) * (1 - num_page);
		var sections = document.querySelectorAll("#main_section>section");
		sections.forEach(function(item) { item.style.transform = "translatex(" + width + "px)";  });
		currentPage = num_page;
	}

	function set_page(num_page){
		if (num_page == numberPages+1 && num_page > 1) {
			searchByKeyword(query, numberColumn, nextPage);
			numberClips += numberColumn;
		}
		else translatex(num_page);	
		var pages = document.querySelectorAll("footer>a");
		pages.forEach(function(item) {
			if (item.id == num_page) item.classList.add("active_page");
			else item.classList.remove("active_page");
		});
	}

	click_page = function (e){
		e.target.innerHTML = "";
		set_page(e.target.id);
	}

	mousedown_page = function (e){
		e.target.innerHTML = "<div class='num_page'>"+e.target.id+"</div>";
	}

	function addClipsPages(){
		clips_pg = document.createElement("a");
		clips_pg.addEventListener("mousedown", mousedown_page);
		clips_pg.addEventListener("click", click_page);
		clips_pg.id = numberPages+1;
		footer.appendChild(clips_pg);
	}

	function addClipsToDocument(items){
		items.forEach(function(item, i) {
			var section = document.createElement("section");

			var img_div = document.createElement("div");
			var img = document.createElement("img");
			img.src = item.thumbnail;
			img_div.appendChild(img);

			var a = document.createElement("a");
			a.innerHTML = "<h1>"+item.title+"</h1>";
			a.href = item.youtubeLink;
			img_div.appendChild(a);

			section.appendChild(img_div);

			var description = document.createElement("p");
			description.innerHTML = item.description;
			section.appendChild(description);

			var info_div = document.createElement("div");
			info_div.classList.add("info_div");
			info_div.innerHTML = "<span>"+item.author+"</span><span>"+item.publishDate+"</span><span>"+item.viewCount+"</span>";
			section.appendChild(info_div);

			section.onmousedown = function(){ return false; };
			section.onselectstart = function(){ return false; };

			main_section.appendChild(section);
		});

		margin_for_section();
		if (numberPages * numberColumn < clips.length) {	
			numberPages++;	
			addClipsPages();
			setTimeout("translatex(numberPages)",100);
		}
		else setTimeout("translatex(currentPage)",100);
	}

	drag = false;
	current_drag = 0;
	function touchstart(e){
		if (mouse_in_section(e.path)) {
			drag = true;
			current_drag = e.touches[0].clientX;
		}
	}
	function touchend(e){
		if (drag) {			
			if (e.changedTouches[0].clientX - current_drag >= 150 && currentPage != 1) set_page(currentPage - 1);
			else if (e.changedTouches[0].clientX - current_drag <= -150) set_page(parseInt(currentPage) + 1);
			else set_page(currentPage);
			dragable(0);
		}
		drag = false;
	}
	function touchmove(e){
		if (drag) { dragable(e.touches[0].clientX - current_drag); }
	}
	function mouse_in_section(path){
		var flag = false;
		path.forEach(function(item){if (item==main_section) flag = true; });
		return flag;
	}
	function mouse_start_set_page(e){
		if (mouse_in_section(e.path)) {
			drag = true;
			current_drag = e.x;
		}
	}
	function mouse_end_set_page(e){
		if (drag) {
			if (e.x - current_drag >= 150 && currentPage != 1) set_page(currentPage - 1);
			else if (e.x - current_drag <= -150) set_page(parseInt(currentPage) + 1);
			else set_page(currentPage);
			dragable(0);
		}
		drag = false;
	}
	function dragable(x){
		var width = (widthSection*numberColumn) * (1 - currentPage);
		var sections = document.querySelectorAll("#main_section>section");
		sections.forEach(function(item) { item.style.transform = "translatex(" + (width+x) + "px)"; });
	}
	function mouse_move_set_page(e){
		if (drag) { dragable(e.x - current_drag); }
	}

	document.body.addEventListener('mousedown', mouse_start_set_page);
	document.body.addEventListener('mousemove', mouse_move_set_page);
	document.body.addEventListener('mouseup', mouse_end_set_page);
	document.body.addEventListener('touchstart', touchstart);
	document.body.addEventListener('touchmove', touchmove);
	document.body.addEventListener('touchend', touchend);
	
	update_paging = function(number) {		
		document.body.removeChild(footer);
		footer = document.createElement("footer");
		document.body.appendChild(footer);

		for (var i=1; i<=number+1; i++) {
			clips_pg = document.createElement("a");
			clips_pg.addEventListener("mousedown", mousedown_page);
			clips_pg.addEventListener("click", click_page);
			clips_pg.id = i;
			footer.appendChild(clips_pg);
		}
	}
	function update_width(){
		var current_first_clip_on_page = (currentPage - 1) * numberColumn + 1;
		numberColumn = number_column();
		var new_Page_number = parseInt((current_first_clip_on_page-1)/numberColumn)+1;
		marginSection = margin_section();
		margin_for_section();
		widthSection = width_block_default+2*marginSection;
		if (clips.length == 0) numberPages = 0;
		else numberPages = parseInt((clips.length - 1) / numberColumn)+1;
		additionally_download = (numberColumn - (numberClips % numberColumn)) % numberColumn;
		searchByKeyword(query, additionally_download,nextPage);
		numberClips += additionally_download;
		if (numberPages != 0) update_paging(numberPages);
		set_page(new_Page_number);
	}
	window.onresize = update_width;
})();