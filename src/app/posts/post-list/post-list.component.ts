import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { Post } from "../interfaces/post.model";
import { PostsService } from "../services/posts.service";

@Component({
  selector: "app-post-list",
  templateUrl: "./post-list.component.html",
  styleUrls: ["./post-list.component.scss"],
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  isLoading = false;
  // Creates a property that will be a Subscription.
  private postsSub: Subscription;
  constructor(public postsService: PostsService) {}

  ngOnInit() {
    this.isLoading = true;
    // Initialize posts on create.
    this.postsService.getPosts();
    // Begin subscription to the posts observable.
    // When the subscription sees a new Post
    // object, it will update our master list of posts.
    this.postsSub = this.postsService
      .getPostUpdateListener()
      .subscribe((posts: Post[]) => {
        this.isLoading = false;
        this.posts = posts;
      });
  }

  onDelete(postId: string) {
    this.postsService.deletePost(postId);
  }

  ngOnDestroy() {
    // If this component gets destroyed, make sure to
    // stop subscribing to prevent memory leaks.
    this.postsSub.unsubscribe();
  }
}
