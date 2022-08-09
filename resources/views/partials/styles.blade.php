<style>
	.showPopup{
		display:block
	}
	.gif-selected{
		border: 4px solid #000;
	}
	.col-2.single-gif {
		margin-bottom: 2vw;
	}
	#content{
		display: none
	}
	.gifs-container{
		max-height: 50vh;
		overflow: auto;
		min-height: 50vh;
		border-top: 1px solid #e5e7eb;
		margin-top: 1rem;
	}
	.ce-block__content, .ce-toolbar__content { max-width:calc(100% - 200px) !important; } 
	.cdx-block { max-width: 100% !important; }
	#editorjs{
		border: 1px solid #ced4da;
		padding: 1rem 0;
		background: #f1f1f1;
		min-height: 40vh;
	}

	.codex-editor__redactor{
		padding-bottom: 50px !important
	}
	a{
		text-decoration: none !important
	}
	.simple-image img
	{
		background: #fff;
		min-height: 200px;
		min-width: 200px;

	}
	.single-gif .image-container{
		background: #f1f1f1;
		min-height: 160px;	
		min-width: inherit
	}
</style>
<!-- Bootstrap core CSS -->
@vite(['resources/css/app.css'])
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
