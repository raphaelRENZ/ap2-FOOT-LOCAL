<?php

namespace App\Controller\Api;

use App\Entity\News;
use App\Repository\NewsRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/news', name: 'api_news_')]
final class ApiNewsController extends AbstractController
{
    #[Route('', name: 'list', methods: ['GET'])]
    public function list(Request $request, NewsRepository $repo): JsonResponse
    {
        $limit = (int) $request->query->get('limit', 0);
        $news = $repo->findPublished($limit > 0 ? $limit : null);

        return $this->json([
            'status' => 'success',
            'data' => array_map(fn(News $n) => [
                'id' => $n->getId(),
                'title' => $n->getTitle(),
                'subtitle' => $n->getSubtitle(),
                'description' => $n->getDescription(),
                'imageUrl' => $n->getImageUrl(),
                'position' => $n->getPosition(),
                'isPublished' => $n->isPublished(),
                'createdAt' => $n->getCreatedAt()?->format(DATE_ATOM),
                'updatedAt' => $n->getUpdatedAt()?->format(DATE_ATOM),
            ], $news),
        ]);
    }

    #[Route('/{id}', name: 'show', methods: ['GET'])]
    public function show(int $id, NewsRepository $repo): JsonResponse
    {
        $news = $repo->find($id);

        if (!$news || !$news->isPublished()) {
            return $this->json(['status' => 'error', 'message' => 'Actualité introuvable.'], 404);
        }

        return $this->json([
            'status' => 'success',
            'data' => [
                'id' => $news->getId(),
                'title' => $news->getTitle(),
                'subtitle' => $news->getSubtitle(),
                'description' => $news->getDescription(),
                'imageUrl' => $news->getImageUrl(),
                'position' => $news->getPosition(),
                'isPublished' => $news->isPublished(),
                'createdAt' => $news->getCreatedAt()?->format(DATE_ATOM),
                'updatedAt' => $news->getUpdatedAt()?->format(DATE_ATOM),
            ],
        ]);
    }
}
