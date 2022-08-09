<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('Add Article') }}
        </h2>
    </x-slot>
	<div class='max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8'>
		<div class="row">
			<div class="col-lg-12 margin-tb">

				<div class="pull-right">
					<a class="btn btn-primary pb-2" href="{{ route('articles') }}"> Back</a>
				</div>
			</div>
		</div>
		@if(session('status'))
		<div class="alert alert-success mb-1 mt-1">
			{{ session('status') }}
		</div>
		@endif
		<form action="{{ route('articles.store') }}" method="POST" enctype="multipart/form-data">
			@csrf
			<div class="row">
				<div class="col-xs-12 col-sm-12 col-md-12 pt-3">
					<div class="form-group">
						<strong>Article Title:</strong>
						<input type="text" name="title" class="form-control" placeholder="Article Title">
						@error('title')
						<div class="alert alert-danger mt-1 mb-1">{{ $message }}</div>
						@enderror
					</div>
				</div>

				<div class="col-xs-12 col-sm-12 col-md-12 pt-3">
					<div class="form-group">
						<strong>Article Content:</strong>
						<div id="editorjs"></div>
						<pre id="output"></pre>
						<textarea name="content" id='content' class="form-control"  placeholder="Article Content"></textarea>
						@error('contnet')
						<div class="alert alert-danger mt-1 mb-1">{{ $message }}</div>
						@enderror
					</div>
				</div>
				<div class="form-group pt-2">
					<button type="submit" class="btn btn-primary float-end" id='submit-article'>Submit</button>
				</div>
			</div>
		</form>

		@vite(['resources/js/EditorjsConfig.js'])
		@extends('layouts.popup')
	</div>
</x-app-layout>