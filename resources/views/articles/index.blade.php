
<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('Articles') }}
        </h2>
    </x-slot>
	<div class='max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8'>
		<div class="row">
			<div class="col-lg-12 margin-tb">

				<div class="pull-right">
					<a class="btn btn-success" href="{{ route('articles.create') }}"> Create New Article</a>
				</div>
			</div>
		</div>
		<br/>

		@if ($message = Session::get('success'))
		<div class="alert alert-success">
			<p>{{ $message }}</p>
		</div>
		@endif

		<table class="table table-bordered">
			<tr>
				<th>No</th>
				<th>Title</th>

				<th width="280px">Action</th>
			</tr>
			@foreach ($articles as $article)
			<tr>
				<td>{{ ++$i }}</td>
				<td>{{ $article->title }}</td>
				<td>
					<form action="{{ route('articles.destroy',["id" => $article->id]) }}" method="POST">
						<a class="btn btn-info" href="{{ route('articles.show',$article->slug) }}">Show</a>
						<a class="btn btn-primary" href="{{ route('articles.edit',$article->id) }}">Edit</a>

						@csrf
						@method('DELETE')

						<button type="submit" class="btn btn-danger">Delete</button>
					</form>
				</td>
			</tr>
			@endforeach
		</table>

		{!! $articles->links() !!}
	</div>
</x-app-layout>

