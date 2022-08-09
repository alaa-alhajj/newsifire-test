<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Article;

class ArticleController extends Controller {

	/**
	 * Display a listing of the resource.
	 *
	 * @return \Illuminate\Http\Response
	 */
	public function index() {

		$articles = Article::latest()->paginate(5);



		return view('articles.index', compact('articles'))
						->with('i', (request()->input('page', 1) - 1) * 5);
	}

	/**
	 * Show the form for creating a new resource.
	 *
	 * @return \Illuminate\Http\Response
	 */
	public function create() {
		return view('articles.create');
	}

	/**
	 * Store a newly created resource in storage.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @return \Illuminate\Http\Response
	 */
	public function store(Request $request) {
		$request->validate([
			'title' => 'required'
		]);

		Article::create($request->post());

		return redirect()->route('articles')->with('success', 'Article has been created successfully.');
	}

	/**
	 * Display the specified resource.
	 *
	 * @param  \App\Article  $article
	 * @return \Illuminate\Http\Response
	 */
	public function show($slug) {
		$article = Article::where('slug', $slug)->first();
		if (!empty($article)) {
			$article->content = !empty($article->content) ? Article::ConvertContentToHTML($article->content) : '';
			return view('articles.show', ['article' => $article]);
		}else{
			return view('auth.login');
		}
		
	}

	/**
	 * Show the form for editing the specified resource.
	 *
	 * @param  \App\Article  $article
	 * @return \Illuminate\Http\Response
	 */
	public function edit($id) {
		$article = Article::find($id);
		return view('articles.edit', ['article' => $article]);
	}

	/**
	 * Update the specified resource in storage.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @param  \App\Article  $article
	 * @return \Illuminate\Http\Response
	 */
	public function update(Request $request, Article $article) {

		$request->validate([
			'title' => 'required'
		]);

		$article->fill($request->post())->save();

		return redirect()->route('articles')->with('success', 'Article Has Been updated successfully');
	}

	/**
	 * Remove the specified resource from storage.
	 *
	 * @param  \App\Article  $article
	 * @return \Illuminate\Http\Response
	 */
	public function destroy($id) {
		$article = Article::find($id);
		$article->delete();
		return redirect()->route('articles')->with('success', 'Article has been deleted successfully');
	}

}
