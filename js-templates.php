<script id="tmpl-index" type="text/html">
	<section class="post-list placeholders">
		<article class="post"></article>
		<article class="post"></article>
		<article class="post"></article>
		<article class="post"></article>
		<article class="post"></article>
		<article class="post"></article>
		<article class="post"></article>
	</section>
</script>

<script id="tmpl-navigation" type="text/html">
</script>

<script id="tmpl-background" type="text/html">
	<svg class="decoration {{data.class}}" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 250 250" width="{{ data.size }}" height="{{data.size}}">
		<polygon points="2,123 123,248 248,123 123,2" />
	</svg>
</script>

<script id="tmpl-pagination" type="text/html">
	<div class="navigation" style="display:none;">
		<a href="#" class="load-more">Load More</a>
	</div>
</script>

<script id="tmpl-content" type="text/html">
	<article class="post" style="display:none;">

	<# if ( data.featured_image && data.featured_image.source ) { #>

		<a class="entry-image" href="/post/{{ data.ID }}" style="background-image: url('{{data.featured_image.source}}');">&nbsp;</a>

	<# } else { #>

		<h1 class="entry-title"><a href="/post/{{ data.ID }}">{{ data.title }}</a></h1>

	<# } #>

	</article>
</script>

<script id="tmpl-single" type="text/html">
	<a class="genericon genericon-close-alt close"></a>
	<# if ( data.featured_image && data.featured_image.source ) { #>
		<img src="{{data.featured_image.source}}" />
	<# } #>
	<h1 class="entry-title">{{ data.title }}</h1>
	<div class="post">{{{ data.content }}}</div>
</script>