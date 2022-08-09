<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Article extends Model {

	use HasFactory;

	protected $fillable = ['title', 'slug', 'content'];

	/**

	 * Boot the model.

	 */
	protected static function boot() {
		parent::boot();

		static::created(function ($article) {

			$article->slug = $article->createSlug($article->title);

			$article->save();
		});
	}

	/**
	 * Write code on Method
	 *
	 * @return response()
	 */
	private function createSlug($title) {
		if (static::whereSlug($slug = Str::slug($title))->exists()) {

			$max = static::whereTitle($title)->latest('id')->skip(1)->value('slug');

			if (isset($max[-1]) && is_numeric($max[-1])) {

				return preg_replace_callback('/(\d+)$/', function ($mathces) {

					return $mathces[1] + 1;
				}, $max);
			}
			return "{$slug}-2";
		}
		return $slug;
	}

	static function ConvertContentToHTML($content) {
		$HTML = '';
		if (!empty($content)) {
			$JSON_Content = json_decode(strval($content), TRUE);

			foreach ($JSON_Content['blocks'] as $block) {
				if (!empty($block)) {
					switch ($block['type']) {
						case "paragraph":
							$HTML .= "<p>" . $block['data']['text'] . "</p>";
							break;
						case "image":
						case "url":
							$HTML .= "<div class='simple-image'><img src='" . $block['data']['url'] . "'/></div><br/>";
							break;
					}
				}
			}
		}

		return $HTML;
	}

}
