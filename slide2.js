$(document).ready(function() {
  let currentSlide = 0;

  function showSlide(index) {
    const slides = $('.slides');
    const totalSlides = slides.children().length;

    currentSlide = (index + totalSlides) % totalSlides;
    slides.css('transform', `translateX(-${currentSlide * 100}%)`);
  }

  setInterval(() => {
    showSlide(currentSlide + 1);
  }, 3000);

  function adjustIframeHeight(iframe) {
    if (iframe) {
      $(iframe).on('load', function () {
        const contentHeight = $(iframe).contents().find('body').prop('scrollHeight') + 'px';
        $(iframe).css('height', contentHeight);

        const fullSectionContainer = $('section.iframe-container');
        if (fullSectionContainer.length) {
          fullSectionContainer.css('height', contentHeight);
        }
      });
    }
  }

  window.loadContent = function(src) {
    const slides = $('.slides');
    const leftSection = $('.left');
    const rightSection = $('#content');

    // 슬라이드 숨기기
    slides.hide();

    // Ajax로 콘텐츠 로드
    $.ajax({
      url: src,
      dataType: 'html',
      success: function(data) {
        const content = $(`<div class="scoped-style">${data}</div>`);
        rightSection.html(content);

        // iframe의 data-src를 src로 변경하여 YouTube 동영상 로드
        content.find('iframe').each(function() {
          const iframeSrc = $(this).attr('data-src');
          if (iframeSrc) {
            $(this).attr('src', iframeSrc);
          }
        });

        // 로드된 스크립트 수동 실행
        content.find('script').each(function() {
          const script = document.createElement('script');
          script.text = $(this).text();
          document.head.appendChild(script).parentNode.removeChild(script);
        });

        // 서브 콘텐츠에 style_sub.css를 추가
        $('<link>')
          .appendTo(content)
          .attr({ type: 'text/css', rel: 'stylesheet' })
          .attr('href', 'knitting/style_sub.css');
      },
      error: function() {
        rightSection.html('<p>컨텐츠를 로드하는 중 오류가 발생했습니다.</p>');
      }
    });

    leftSection.show();
    rightSection.show();
  };

  window.showFullSectionAjax = function(url) {
    const leftSection = $('.left');
    const rightSection = $('.right');
    const slides = $('.slides');
    const container = $('.container');
    const fullSectionContainer = $('section.iframe-container');

    if (leftSection.length) leftSection.hide();
    if (rightSection.length) rightSection.hide();
    if (slides.length) slides.hide();
    if (container.length) container.hide();

    if (fullSectionContainer.length) {
      $.ajax({
        url: url,
        method: 'GET',
        success: function(data) {
          fullSectionContainer.html(data).show().css('height', '100vh');
          
          // CSS 파일 경로를 다시 확인하고 동적으로 추가
          const linkTag = $('<link>', {
            rel: 'stylesheet',
            type: 'text/css',
            href: 'knitting/style_sub.css'
          });

          linkTag.on('load', function() {
            console.log('CSS 파일 로드 성공');
          }).on('error', function() {
            console.error('CSS 파일 로드 실패');
          });

          $('head').append(linkTag);
          
          // 높이 조정
          adjustIframeHeight(fullSectionContainer);
        },
        error: function(xhr, status, error) {
          console.error('Error loading content:', status, error);
        }
      });
    }

    $('html').css('overflow', 'hidden');
    $('body').css('overflow', 'auto');
  };

  window.loadFullSection = function(src) {
    const leftSection = $('.left');
    const rightSection = $('.right');
    const container = $('.container');
    const contentSection = $('#content');

    // 모든 섹션 숨기기
    leftSection.hide();
    rightSection.hide();
    container.hide();

    // Ajax로 콘텐츠 로드 (풀 섹션 용)
    $.ajax({
      url: src,
      dataType: 'html',
      success: function(data) {
        const content = $(`<div class="scoped-style">${data}</div>`);
        contentSection.html(content).show();

        // iframe의 data-src를 src로 변경하여 YouTube 동영상 로드
        content.find('iframe').each(function() {
          const iframeSrc = $(this).attr('data-src');
          if (iframeSrc) {
            $(this).attr('src', iframeSrc);
          }
        });

        // 로드된 스크립트 수동 실행
        content.find('script').each(function() {
          const script = document.createElement('script');
          script.text = $(this).text();
          document.head.appendChild(script).parentNode.removeChild(script);
        });

        // 서브 콘텐츠에 style_sub.css를 추가
        $('<link>')
          .appendTo(content)
          .attr({ type: 'text/css', rel: 'stylesheet' })
          .attr('href', 'knitting/style_sub.css');
      },
      error: function() {
        contentSection.html('<p>컨텐츠를 로드하는 중 오류가 발생했습니다.</p>');
      }
    });

    $('html, body').css('overflow', 'hidden');
  };

  window.showHome = function() {
    const leftSection = $('.left');
    const rightSection = $('.right');
    const slides = $('.slides');

    leftSection.show();
    rightSection.show();
    slides.show();

    $('html, body').css('overflow', 'auto');
  };
});

