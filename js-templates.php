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

<script id="tmpl-pagination" type="text/html">
	<div class="navigation" style="display:none;">
		<a href="#" class="next-page">Load More</a>
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
	<h1 class="entry-title">{{ data.title }}</h1>
	<div class="post">{{{ data.content }}}</div>
</script>