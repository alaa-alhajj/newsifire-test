<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('Show Article') }}
        </h2>
    </x-slot>
	<div class='max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8'>
    <div class="row">
        <div class="col-lg-12 margin-tb">
			
            <div class="pull-left">
                <h2> 
					 @if ($article !== null)  {{ $article->title }}
				 @endif 
				</h2>
            </div>
            
        </div>
    </div>
   
    <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-12">
            <div class="form-group">
				 @if ($article !== null)
                {!!  $article->content !!}
				@else
				 <div class="relative flex items-top justify-center min-h-screen bg-gray-100 dark:bg-gray-900 sm:items-center sm:pt-0">
				  <div class="ml-4 text-lg text-gray-500 uppercase tracking-wider">
                        Not found
                    </div>
				 </div>
				  @endif 
            </div>
			<div class="pull-right">
				@if (Auth::check())
				<br/>
                <a class="btn btn-primary" href="{{ route('articles') }}"> Back</a>
				@endif
            </div>
        </div>
    </div>
	</div>
</x-app-layout>	