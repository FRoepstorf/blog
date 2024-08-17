<?php

declare(strict_types=1);

use Rector\Config\RectorConfig;
use Rector\Set\ValueObject\LevelSetList;
use Rector\Set\ValueObject\SetList;
use Rector\TypeDeclaration\Rector\StmtsAwareInterface\DeclareStrictTypesRector;
use RectorLaravel\Set\LaravelLevelSetList;
use RectorLaravel\Set\LaravelSetList;
use Spatie\Ray\Rector\RemoveRayCallRector;

return RectorConfig::configure()
    ->withPaths([__DIR__.'/app'])
    ->withRules([
        DeclareStrictTypesRector::class,
        RemoveRayCallRector::class,
    ])
    ->withSets([
        LevelSetList::UP_TO_PHP_83,
        LaravelLevelSetList::UP_TO_LARAVEL_110,
        LaravelSetList::LARAVEL_CODE_QUALITY,
        LaravelSetList::ARRAY_STR_FUNCTIONS_TO_STATIC_CALL,
        LaravelSetList::LARAVEL_STATIC_TO_INJECTION,
        SetList::CODE_QUALITY,
        SetList::DEAD_CODE,
        SetList::NAMING,
        SetList::EARLY_RETURN,
    ]);
