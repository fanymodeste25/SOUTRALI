from rest_framework import serializers
from .models import BlogCategory, BlogPost


class BlogCategorySerializer(serializers.ModelSerializer):
    post_count = serializers.SerializerMethodField()

    class Meta:
        model = BlogCategory
        fields = ['id', 'name', 'slug', 'description', 'post_count', 'created_at', 'updated_at']
        read_only_fields = ['slug', 'created_at', 'updated_at']

    def get_post_count(self, obj):
        return obj.posts.filter(status='published').count()


class BlogPostListSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.get_full_name', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    read_time = serializers.SerializerMethodField()

    class Meta:
        model = BlogPost
        fields = [
            'id', 'title', 'slug', 'excerpt', 'featured_image',
            'author_name', 'category', 'category_name', 'status',
            'is_featured', 'views_count', 'published_at', 'created_at',
            'read_time'
        ]
        read_only_fields = ['slug', 'views_count', 'created_at']

    def get_read_time(self, obj):
        """Calculate estimated read time in minutes"""
        words = len(obj.content.split())
        minutes = max(1, words // 200)  # Assuming 200 words per minute
        return minutes


class BlogPostDetailSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.get_full_name', read_only=True)
    author_email = serializers.CharField(source='author.email', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_slug = serializers.CharField(source='category.slug', read_only=True)
    read_time = serializers.SerializerMethodField()

    class Meta:
        model = BlogPost
        fields = [
            'id', 'title', 'slug', 'excerpt', 'content', 'featured_image',
            'author', 'author_name', 'author_email',
            'category', 'category_name', 'category_slug',
            'status', 'is_featured', 'views_count', 'published_at',
            'created_at', 'updated_at', 'read_time'
        ]
        read_only_fields = ['slug', 'views_count', 'created_at', 'updated_at']

    def get_read_time(self, obj):
        """Calculate estimated read time in minutes"""
        words = len(obj.content.split())
        minutes = max(1, words // 200)  # Assuming 200 words per minute
        return minutes


class BlogPostCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogPost
        fields = [
            'title', 'excerpt', 'content', 'featured_image',
            'category', 'status', 'is_featured', 'published_at'
        ]

    def validate_title(self, value):
        if len(value) < 10:
            raise serializers.ValidationError("Title must be at least 10 characters long.")
        return value

    def validate_excerpt(self, value):
        if len(value) < 20:
            raise serializers.ValidationError("Excerpt must be at least 20 characters long.")
        return value

    def validate_content(self, value):
        if len(value) < 100:
            raise serializers.ValidationError("Content must be at least 100 characters long.")
        return value
