<script id="tmpl-index" type="text/html">
	<h2>Posts!</h2>
</script>

<script id="tmpl-pagination" type="text/html">
	<div class="navigation">
		<a href="#" class="next-page">Load More</a>
	</div>
</script>

<script id="tmpl-content" type="text/html">
	<article class="post">

		<# if ( data.featured_image && data.featured_image.attachment_meta && data.featured_image.attachment_meta.sizes['post-thumbnail'] ) { #>
			<img src="{{data.featured_image.attachment_meta.sizes['post-thumbnail'].url}}" />
		<# } #>

		<h1><a href="/post/{{ data.ID }}">{{ data.title }}</a></h1>

	</article>
</script>

<script id="tmpl-single" type="text/html">
	<h1>{{ data.title }}</h1>
	<div class="post">{{{ data.content }}}</div>
</script>